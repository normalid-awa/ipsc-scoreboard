import { treaty } from "@elysiajs/eden";
import type { App } from "@ipsc_scoreboard/api";
import env from "./env";

const { api } = treaty<App>(env.VITE_BACKEND_API_URL, {
	fetch: {
		credentials: "include",
	},
});

export { api };
