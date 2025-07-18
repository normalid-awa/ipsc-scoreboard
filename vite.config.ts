import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
	server: {
		port: 3000,
		host: "0.0.0.0",
		proxy: {},
	},
	plugins: [basicSsl(), tsConfigPaths(), tanstackStart({})],
});
