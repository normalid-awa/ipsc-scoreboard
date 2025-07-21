import { createFileRoute } from "@tanstack/react-router";
import { ROUTE_ORDER as PREV_ROUTE_ORDER } from "./index";
import { ListedRouteStaticData } from "@/router";
import Timer from "@/components/timer/Timer";
import TimerIcon from "@mui/icons-material/Timer";

export const ROUTE_ORDER = PREV_ROUTE_ORDER + 1;
export const Route = createFileRoute("/timer")({
	component: RouteComponent,
	staticData: {
		displayName: "Timer",
		icon: <TimerIcon />,
		needAuth: false,
		order: ROUTE_ORDER,
	} satisfies ListedRouteStaticData,
});

function RouteComponent() {
	return (
		<>
			<Timer />
		</>
	);
}
