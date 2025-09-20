import { defineConfig, loadEnv } from "vite";
import viteReact from "@vitejs/plugin-react-swc";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { devtools } from "@tanstack/devtools-vite";
import { readFileSync } from "fs";
import env from "@/env";

const config = defineConfig((confEnv) => {
	const loadedEnv = loadEnv(confEnv.mode, process.cwd()) as typeof env;
	let https = undefined;
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
			proxy: {
				"/api": {
					target: loadedEnv.VITE_BACKEND_API_URL,
					changeOrigin: true,
					secure: false,
				},
			},
			https,
		},
		plugins: [
			viteTsConfigPaths({
				projects: ["./tsconfig.json"],
			}),
			tanstackStart({
				customViteReactPlugin: true,
				target: "cloudflare-pages",
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
				external: ["@t3-oss/env-core"],
			},
		},
	};
});

export default config;
