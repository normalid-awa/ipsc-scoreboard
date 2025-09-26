import { createEnv } from "@t3-oss/env-core";
import { vite } from "@t3-oss/env-core/presets-zod";
import { z } from "zod";

console.debug(process.env.VITE_BACKEND_API_URL, {
	...process.env,
	...import.meta.env,
});

const env = createEnv({
	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: "VITE_",

	isServer: import.meta.env.SSR,

	client: {
		VITE_BACKEND_API_URL: z.string().url(),
		VITE_TITLE_PREFIX: z.string().default("IPSC Scoreboard |"),
	},

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */

	runtimeEnvStrict: {
		VITE_BACKEND_API_URL: process.env.VITE_BACKEND_API_URL,
		VITE_TITLE_PREFIX: process.env.VITE_TITLE_PREFIX,
	},

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,

	skipValidation: import.meta.env.PROD,

	// TODO: Don't know why this doesn't work
	// extends: [vite()],
});

export default env;
