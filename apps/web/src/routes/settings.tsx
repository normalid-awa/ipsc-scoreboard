import { createFileRoute } from "@tanstack/react-router";
import { ListedRouteStaticData } from "../router";
import ModeSwitch from "../components/ModeSwitch";
import SettingsIcon from "@mui/icons-material/Settings";
import env from "@/env";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
	staticData: {
		displayName: "Settings",
		icon: <SettingsIcon />,
		needAuth: false,
		order: 4,
	} satisfies ListedRouteStaticData,
	head: () => ({ meta: [{ title: `${env.VITE_TITLE_PREFIX} Settings` }] }),
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
