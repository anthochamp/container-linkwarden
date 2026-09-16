import { expect, describe, it } from "vitest";

import { initSuite, SPECIAL_CHARS_PASSWORD } from "./common";

describe("startup", () => {
	const { useContainer } = initSuite();

	// The DATABASE_URL is built by the entrypoint by URI-encoding each credential
	// with encodeUriComponent(). If a DB password contains URI-special characters
	// (@ # / = …) and encoding is applied correctly, Prisma can parse the URL,
	// migrate the schema, and the app starts. If encoding is missing or wrong,
	// Prisma fails to parse the URL and the container crashes.
	describe("DB password contains URI-special characters", () => {
		const { url } = useContainer({ dbPassword: SPECIAL_CHARS_PASSWORD });

		it("starts and runs database migrations", async () => {
			const response = await fetch(url);
			expect(response.status).toBeGreaterThanOrEqual(200);
			expect(response.status).toBeLessThan(500);
		});
	});
});
