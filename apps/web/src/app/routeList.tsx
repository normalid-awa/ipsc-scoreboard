import { ReactNode } from "react";
import { Route as NextRoute } from "next";
import { Home } from "@mui/icons-material";

export interface Route {
	path: NextRoute;
	icon: ReactNode;
	name: string;
	shouldBeShow?: () => boolean;
}

export const routes: Route[] = [
	{
		path: "/",
		icon: <Home />,
		name: "Home",
	},
];
