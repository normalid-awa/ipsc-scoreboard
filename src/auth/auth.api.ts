import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { auth } from "./auth.server";

export const getUserSession = createServerFn().handler(async () => {
	const request = getWebRequest();
	return await auth.api.getSession({ headers: request.headers });
});

export const redirectIfUnauthenticated = createServerFn().handler(async () => {
	if (!(await getUserSession())) {
		throw redirect({ to: "/login" });
	}
});
