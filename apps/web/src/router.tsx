import {
	createRouter as createTanstackRouter,
	StaticDataRouteOption,
} from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./providers/root-provider";

// Import the generated route tree
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

// Create a new router instance
export const createRouter = () => {
	const rqContext = TanstackQuery.getContext();

	const router = createTanstackRouter({
		routeTree,
		context: {
			...rqContext /**
			 session: undefined! 
		*/,
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
