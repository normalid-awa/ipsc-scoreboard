import { createFileRoute } from "@tanstack/react-router";
import { ListedRouteStaticData } from "../router";
import HomeIcon from "@mui/icons-material/Home";

export const ROUTE_ORDER = 1;
export const Route = createFileRoute("/")({
	component: Index,
	staticData: {
		displayName: "Home",
		icon: <HomeIcon />,
		needAuth: false,
		order: ROUTE_ORDER,
	} satisfies ListedRouteStaticData,
});

function Index() {
	return <></>;
}
