import { createFileRoute } from "@tanstack/react-router";
import { ListedRouteStaticData } from "../router";
import { Settings } from "@mui/icons-material";
import { ROUTE_ORDER as PREV_ROUTE_ORDER } from "./timer";
import ModeSwitch from "../components/ModeSwitch";

export const ROUTE_ORDER = PREV_ROUTE_ORDER + 1;
export const Route = createFileRoute("/settings")({
	component: SettingsPage,
	staticData: {
		displayName: "Settings",
		icon: <Settings />,
		needAuth: false,
		order: ROUTE_ORDER,
	} satisfies ListedRouteStaticData,
});

function SettingsPage() {
	return (
		<>
			<div>
				<ModeSwitch />
			</div>
		</>
	);
}
