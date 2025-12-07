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
			key: readFileSync("../../server.key"),
			cert: readFileSync("../../server.crt"),
			ca: readFileSync("../../ca.crt"),
		};
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	}

	return {
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
				configPath: "../../wrangler.jsonc",
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
				external: ["@ipsc-scoreboare/api", "@ipsc-scoreboard/common"],
			},
		},
	};
});

export default config;
