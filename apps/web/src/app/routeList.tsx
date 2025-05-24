import { ReactNode } from "react";
import { Home } from "@mui/icons-material";

export interface Route {
	path: string;
	icon: ReactNode;
	name: string;
}

export const routes: Route[] = [
	{
		path: "/",
		icon: <Home />,
		name: "Home",
	},
];
