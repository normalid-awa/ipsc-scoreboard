import { AutoMode, DarkMode, LightMode } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup, useColorScheme } from "@mui/material";

export default function ModeSwitch() {
	const { mode, setMode } = useColorScheme();
	if (!mode) {
		return null;
	}
	return (
		<ToggleButtonGroup
			value={mode}
			onChange={(event, value) => setMode(value as "system" | "light" | "dark")}
			exclusive
			color="primary"
		>
			<ToggleButton value="light">
				<LightMode />
			</ToggleButton>
			<ToggleButton value="system">
				<AutoMode />
			</ToggleButton>
			<ToggleButton value="dark">
				<DarkMode />
			</ToggleButton>
		</ToggleButtonGroup>
	);
}
