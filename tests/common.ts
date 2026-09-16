import * as path from "node:path";

import type { DockerContainerRunOptions } from "@ac-kit/cmd-docker";
import { getRandomEphemeralPort } from "@ac-kit/core";
import type { EnvVariables } from "@ac-kit/format-shell";
import { initDockerSuite } from "@ac-kit/integration-test-util";
import { isHttpAvailable } from "@ac-kit/net-http";
import type { StartedTestContainer } from "testcontainers";
import { GenericContainer, Wait } from "testcontainers";
import { afterAll, beforeAll, vi } from "vitest";

const srcPath = path.resolve(path.join(__dirname, "..", "src"));

const PG_PORT = 5432;
const LINKWARDEN_APP_PORT = 3000;

export const DB_NAME = "linkwarden";
export const DB_USER = "linkwarden";

// A password with URI-special characters that require percent-encoding.
// The entrypoint calls encodeUriComponent() on each credential before building
// the DATABASE_URL. If encoding is correct this container starts; if broken the
// Prisma migration fails and the container crashes.
export const SPECIAL_CHARS_PASSWORD = "p@ss#w0rd/test=1";

type ContainerRunOptions = Omit<
	DockerContainerRunOptions,
	"name" | "context" | "detach"
>;

type UseContainerOptions = {
	dbPassword?: string;
	env?: EnvVariables;
};

export function initSuite() {
	let pg: StartedTestContainer | undefined;
	let pgPort: number;

	let pendingRunOptions: ContainerRunOptions = {};
	let pendingUrl = "";

	const { containerImageName } = initDockerSuite(srcPath, {
		containerNamePrefix: "test-linkwarden-",
		containerRunOptions: () => pendingRunOptions,
		onContainerStarted: async () => {
			await vi.waitUntil(() => isHttpAvailable(pendingUrl), {
				timeout: 240_000,
				interval: 2000,
			});
		},
	});

	beforeAll(async () => {
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
	});

	afterAll(async () => {
		await pg?.stop();
	});

	return {
		containerImageName,
		/** Registers the container's run options for every test in this describe. */
		useContainer: (options?: UseContainerOptions) => {
			const appPort = getRandomEphemeralPort();
			const dbPassword = options?.dbPassword ?? SPECIAL_CHARS_PASSWORD;
			const url = `http://127.0.0.1:${appPort}`;

			beforeAll(() => {
				const baseEnv: EnvVariables = {
					LINKWARDEN_URL: `http://localhost:${appPort}`,
					LINKWARDEN_SECRET_KEY: "test-secret-key-for-integration-tests-only",
					LINKWARDEN_DB_HOST: "host.docker.internal",
					LINKWARDEN_DB_PORT: String(pgPort),
					LINKWARDEN_DB_NAME: DB_NAME,
					LINKWARDEN_DB_USER: DB_USER,
					LINKWARDEN_DB_PASSWORD: dbPassword,
				};

				pendingRunOptions = {
					addHost: ["host.docker.internal:host-gateway"],
					publish: [`${appPort}:${LINKWARDEN_APP_PORT}`],
					env: { ...baseEnv, ...options?.env },
				};
				pendingUrl = url;
			});

			return { appPort, url };
		},
	};
}
