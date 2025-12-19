import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

export const getCookie = createIsomorphicFn()
	.client(() => {
		return document.cookie;
	})
	.server(() => {
		return getRequestHeader("Cookie") ?? "";
	});
