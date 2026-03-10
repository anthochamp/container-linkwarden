import { randomBytes } from "node:crypto";
import * as path from "node:path";
import {
	dockerBuildxBuild,
	dockerContainerRm,
	dockerContextShow,
	dockerContextUse,
	dockerImageRm,
} from "@ac-essentials/cli";
import {
	type EnvVariables,
	escapeCommandArg,
	execAsync,
	getRandomEphemeralPort,
	isHttpAvailable,
} from "@ac-essentials/misc-util";
import type { StartedTestContainer } from "testcontainers";
import { GenericContainer, Wait } from "testcontainers";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

const srcPath = path.resolve(path.join(__dirname, "..", "src"));

export const docker = (cmd: string) =>
	execAsync(`docker --context default ${cmd}`, { encoding: "utf-8" });

const PG_PORT = 5432;
const LINKWARDEN_APP_PORT = 3000;

export const DB_NAME = "linkwarden";
export const DB_USER = "linkwarden";

// A password with URI-special characters that require percent-encoding.
// The entrypoint calls encodeUriComponent() on each credential before building
// the DATABASE_URL. If encoding is correct this container starts; if broken the
// Prisma migration fails and the container crashes.
export const SPECIAL_CHARS_PASSWORD = "p@ss#w0rd/test=1";

type StartContainerOptions = {
	dbPassword?: string;
	env?: EnvVariables;
};

export function initSuite() {
	let initialContext: string;
	const containerName = `test-linkwarden-${randomBytes(8).toString("hex")}`;
	const containerImageName = `${containerName}-img`;
	let pg: StartedTestContainer;
	let pgPort: number;

	async function stopContainer() {
		try {
			await dockerContainerRm([containerName], { force: true });
		} catch (_) {}
	}

	beforeAll(async () => {
		initialContext = await dockerContextShow();
		await dockerContextUse("default");

		await stopContainer();

		try {
			await dockerImageRm([containerImageName], { force: true });
		} catch (_) {}

		pg = await new GenericContainer("postgres:16-alpine")
			.withEnvironment({
				POSTGRES_DB: DB_NAME,
				POSTGRES_USER: DB_USER,
				POSTGRES_PASSWORD: SPECIAL_CHARS_PASSWORD,
			})
			.withExposedPorts(PG_PORT)
			.withWaitStrategy(Wait.forListeningPorts())
			.start();

		pgPort = pg.getMappedPort(PG_PORT);

		await dockerBuildxBuild(srcPath, { tags: [containerImageName] });
	});

	afterAll(async () => {
		try {
			await dockerImageRm([containerImageName], { force: true });
		} catch (_) {}
		try {
			await pg.stop();
		} catch (_) {}
		try {
			await dockerContextUse(initialContext);
		} catch (_) {}
	});

	afterEach(async () => {
		await stopContainer();
	});

	return {
		startContainer: async (options?: StartContainerOptions) => {
			const appPort = getRandomEphemeralPort();
			const dbPassword = options?.dbPassword ?? SPECIAL_CHARS_PASSWORD;

			const baseEnv: EnvVariables = {
				LINKWARDEN_URL: `http://localhost:${appPort}`,
				LINKWARDEN_SECRET_KEY: "test-secret-key-for-integration-tests-only",
				LINKWARDEN_DB_HOST: "host.docker.internal",
				LINKWARDEN_DB_PORT: String(pgPort),
				LINKWARDEN_DB_NAME: DB_NAME,
				LINKWARDEN_DB_USER: DB_USER,
				LINKWARDEN_DB_PASSWORD: dbPassword,
			};

			const env = { ...baseEnv, ...options?.env };
			const envArgs = Object.entries(env).map(
				([k, v]) => `-e ${escapeCommandArg(`${k}=${String(v ?? "")}`)}`,
			);
			const envArgsStr = envArgs.join(" ");

			await docker(
				`run -d --name ${containerName}` +
					" --add-host host.docker.internal:host-gateway" +
					` -p ${appPort}:${LINKWARDEN_APP_PORT}` +
					` ${envArgsStr}` +
					` ${containerImageName}`,
			);

			const url = `http://127.0.0.1:${appPort}`;

			await vi.waitUntil(() => isHttpAvailable(url), {
				timeout: 240_000,
				interval: 2000,
			});

			return { appPort, url };
		},
	};
}
