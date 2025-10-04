import { createFileRoute } from "@tanstack/react-router";
import { ListedRouteStaticData } from "../router";
import HomeIcon from "@mui/icons-material/Home";

export const Route = createFileRoute("/")({
	component: Index,
	staticData: {
		displayName: "Home",
		icon: <HomeIcon />,
		needAuth: false,
		order: 0,
	} satisfies ListedRouteStaticData,
});

function Index() {
	return <></>;
}
