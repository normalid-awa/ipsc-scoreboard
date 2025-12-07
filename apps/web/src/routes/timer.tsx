import { createFileRoute } from "@tanstack/react-router";
import { ListedRouteStaticData } from "@/router";
import Timer from "@/components/timer/Timer";
import TimerIcon from "@mui/icons-material/Timer";
import env from "@/env";

export const Route = createFileRoute("/timer")({
	component: RouteComponent,
	staticData: {
		displayName: "Timer",
		icon: <TimerIcon />,
		needAuth: false,
		order: 3,
	} satisfies ListedRouteStaticData,
	head: () => ({ meta: [{ title: `${env.VITE_TITLE_PREFIX} Timer` }] }),
});

function RouteComponent() {
	return (
		<>
			<Timer />
		</>
	);
}
