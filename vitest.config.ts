import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		env: { TESTCONTAINERS_RYUK_DISABLED: "true" },
		testTimeout: 300_000,
		hookTimeout: 600_000,
		isolate: true,
		fileParallelism: false,
		sequence: {
			concurrent: false,
		},
	},
});
