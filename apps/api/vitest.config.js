import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	test: {
		env: {
			NODE_ENV: "staging",
			TESTING: "1",
		},
	},
	plugins: [tsconfigPaths()],
});
