import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getHeaders = createServerOnlyFn(() => {
	return getRequest();
});
