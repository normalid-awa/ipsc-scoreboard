import { treaty } from "@elysiajs/eden";
import type { App } from "@ipsc_scoreboard/api";
import env from "./env";

let apiUrl = "";

if (globalThis.window) apiUrl = location.origin;
else apiUrl = env.VITE_BACKEND_API_URL;

const { api } = treaty<App>(apiUrl, {
	headers: {
		credentials: "include",
	},
});

export { api };
