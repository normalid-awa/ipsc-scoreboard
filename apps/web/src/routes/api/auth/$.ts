import { authClient } from "@/auth/auth.client";
import { createServerFileRoute } from "@tanstack/react-start/server";

// export const ServerRoute = createServerFileRoute("/api/auth/$").methods({
// 	GET: async ({ request }) => {
// 		console.log(request);
// 		const r = await fetch(request);
// 		console.log(await r.json());
// 		return r;
// 	},
// 	POST: async ({ request }) => {
// 		return await fetch(request);
// 	},
// });
