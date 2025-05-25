import { ReactNode } from "react";
import { Route as NextRoute } from "next";
import { Home, Timer } from "@mui/icons-material";

export interface Route {
	path: NextRoute;
	icon: ReactNode;
	name: string;
	// Default is true
	shouldBeShow?: () => boolean;
}

export const routes: Route[] = [
	{
		path: "/",
		icon: <Home />,
		name: "Home",
	},
	{
		path: "/timer",
		icon: <Timer />,
		name: "Timer",
	},
];
