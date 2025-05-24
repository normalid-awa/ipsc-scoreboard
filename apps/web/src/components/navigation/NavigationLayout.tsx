import { Route } from "@/app/routeList";
import { Route as NextRoute } from "next";
import { ReactNode } from "react";

export interface NavigationLayoutProps {
	children: ReactNode;
	routes: Route[];
	navTo: (path: NextRoute) => () => void;
}

export const drawerWidth = 240;
