import env from "@/env";
import { createFileRoute } from "@tanstack/react-router";

function reverseProxy({ request }: { request: Request }) {
	const url = new URL(request.url);
	const newUrl = new URL(url.pathname, env.VITE_BACKEND_API_URL);
	const newRequest = new Request(newUrl, request);
	return fetch(newRequest);
}
export const Route = createFileRoute("/api/$")({
	server: {
		handlers: {
			ALL: reverseProxy,
			DELETE: reverseProxy,
			GET: reverseProxy,
			HEAD: reverseProxy,
			OPTIONS: reverseProxy,
			PATCH: reverseProxy,
			POST: reverseProxy,
			PUT: reverseProxy,
		},
	},
});
