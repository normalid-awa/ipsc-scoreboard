import {
	createRouter as createTanStackRouter,
	StaticDataRouteOption,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ReactElement } from "react";

export interface ListedRouteStaticData extends StaticDataRouteOption {
	displayName: string;
	icon: ReactElement;
	needAuth: boolean;
	order: number;
}

export function isRouteAListedRoute(
	staticData: StaticDataRouteOption | undefined,
): staticData is ListedRouteStaticData {
	if (!staticData) return false;
	staticData = staticData as ListedRouteStaticData;
	if (
		!(
			"displayName" in staticData &&
			"needAuth" in staticData &&
			"icon" in staticData &&
			"order" in staticData
		)
	)
		return false;
	if (typeof staticData.displayName !== "string") return false;
	if (typeof staticData.needAuth !== "boolean") return false;
	if (typeof staticData.icon !== "object") return false;
	if (typeof staticData.order !== "number") return false;
	return true;
}

export const router = createTanStackRouter({
	routeTree,
	scrollRestoration: true,
	context: {
		session: undefined!,
	},
});

export function createRouter() {
	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
