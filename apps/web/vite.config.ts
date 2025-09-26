import { defineConfig, ServerOptions } from "vite";
import viteReact from "@vitejs/plugin-react-swc";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { devtools } from "@tanstack/devtools-vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { readFileSync } from "fs";
import env from "@/env";

const config = defineConfig((confEnv) => {
	let https: ServerOptions["https"] | undefined = undefined;
	if (confEnv.mode == "development") {
		https = {
			key: readFileSync("../../key.pem"),
			cert: readFileSync("../../cert.pem"),
		};
	}
	return {
		environments: {
			ipsc_scoreboard: {
				define: {
					"process.env.VITE_BACKEND_API_URL": import.meta.env
						.VITE_BACKEND_API_URL,
					"process.env.VITE_TITLE_PREFIX": import.meta.env
						.VITE_TITLE_PREFIX,
				} satisfies {
					[K in keyof typeof env as `process.env.${K}`]: unknown;
				},
			},
		},
		server: {
			host: "0.0.0.0",
			allowedHosts: true,
			https,
		},
		plugins: [
			viteTsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
			tanstackStart(),
			cloudflare({
				configPath: "../../wrangler.json",
			}),
			devtools({
				enhancedLogs: {
					enabled: true,
				},
			}),
			viteReact(),
		],
		build: {
			rollupOptions: {
				external: ["@ipsc-scoreboare/api"],
			},
		},
	};
});

export default config;
