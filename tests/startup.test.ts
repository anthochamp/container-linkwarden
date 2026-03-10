import { expect, suite, test } from "vitest";
import { initSuite, SPECIAL_CHARS_PASSWORD } from "./common";

suite.sequential("startup", () => {
	const { startContainer } = initSuite();

	// The DATABASE_URL is built by the entrypoint by URI-encoding each credential
	// with encodeUriComponent(). If a DB password contains URI-special characters
	// (@ # / = …) and encoding is applied correctly, Prisma can parse the URL,
	// migrate the schema, and the app starts. If encoding is missing or wrong,
	// Prisma fails to parse the URL and the container crashes.
	test("starts and runs database migrations when DB password contains URI-special characters", async () => {
		const { url } = await startContainer({
			dbPassword: SPECIAL_CHARS_PASSWORD,
		});

		const response = await fetch(url);
		expect(response.status).toBeGreaterThanOrEqual(200);
		expect(response.status).toBeLessThan(500);
	});
});
