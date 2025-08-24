import {
	createRouter as createTanstackRouter,
	StaticDataRouteOption,
} from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./providers/root-provider";
import { routeTree } from "./routeTree.gen";
import { ReactElement } from "react";
import { hc } from "hono/client";
import { AppType } from "@ipsc_scoreboard/api";
import { QueryClient } from "@tanstack/react-query";

export interface MyRouterContext {
	queryClient: QueryClient;
	rpc: ReturnType<typeof hc<AppType>>;
}

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

// Create a new router instance
export const createRouter = () => {
	const rqContext = TanstackQuery.getContext();

	const client = hc<AppType>("");

	const router = createTanstackRouter({
		routeTree,
		context: {
			...rqContext,
			rpc: client,
		},
		defaultPreload: "intent",
		Wrap: (props: { children: React.ReactNode }) => {
			return (
				<TanstackQuery.Provider {...rqContext}>
					{props.children}
				</TanstackQuery.Provider>
			);
		},
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
