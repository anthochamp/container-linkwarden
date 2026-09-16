import { defineProject } from "@ac-kit/vitest-config";

export default defineProject({
	test: {
		env: { TESTCONTAINERS_RYUK_DISABLED: "true" },
		testTimeout: 300_000,
		hookTimeout: 60_000,
		isolate: true,
		fileParallelism: false,
		sequence: {
			concurrent: false,
		},
	},
});
