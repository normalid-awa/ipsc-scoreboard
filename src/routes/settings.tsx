import { createFileRoute } from "@tanstack/react-router";
import { ListedRouteStaticData } from "../router";
import { Settings } from "@mui/icons-material";
import { ROUTE_ORDER as PREV_ROUTE_ORDER } from "./timer";
import ModeSwitch from "../components/ModeSwitch";
import LoginForm from "@/components/LoginForm";
import { Paper } from "@mui/material";
import { UserCard } from "@/components/UserCard";

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
				<UserCard />
				<Paper sx={{ p: 2, width: 540 }}>
					<LoginForm />
				</Paper>
			</div>
		</>
	);
}
