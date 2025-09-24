import { defineConfig, ServerOptions } from "vite";
import viteReact from "@vitejs/plugin-react-swc";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { devtools } from "@tanstack/devtools-vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { readFileSync } from "fs";

const config = defineConfig((confEnv) => {
	let https: ServerOptions["https"] | undefined = undefined;
	if (confEnv.mode == "development") {
		https = {
			key: readFileSync("../../key.pem"),
			cert: readFileSync("../../cert.pem"),
		};
	}
	return {
		server: {
			host: "0.0.0.0",
			allowedHosts: true,
			// To disable http2, due to backend is not support http2
			proxy: {},
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
				// external: ["@t3-oss/env-core"],
			},
		},
	};
});

export default config;
