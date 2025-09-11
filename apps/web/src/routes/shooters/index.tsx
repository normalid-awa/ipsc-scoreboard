import PeopleIcon from "@mui/icons-material/People";
import { createFileRoute } from "@tanstack/react-router";
import { ROUTE_ORDER as PREV_ROUTE_ORDER } from "../timer";
import { ListedRouteStaticData } from "@/router";
import env from "@/env";

export const ROUTE_ORDER = PREV_ROUTE_ORDER + 1;

export const Route = createFileRoute("/shooters/")({
	component: RouteComponent,
	staticData: {
		displayName: "Shooters list",
		icon: <PeopleIcon />,
		needAuth: false,
		order: ROUTE_ORDER,
	} satisfies ListedRouteStaticData,
	head: () => ({
		meta: [{ title: `${env.VITE_TITLE_PREFIX} Shooters list` }],
	}),
});

function RouteComponent() {
	return <div>Hello "/shooters/shooters"!</div>;
}
