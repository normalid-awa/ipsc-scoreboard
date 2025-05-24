import {
	ThemeType,
	useLocalPreferences,
} from "@/providers/LocalPreferencesProvider";
import { AutoMode, DarkMode, LightMode } from "@mui/icons-material";
import { Button, ButtonGroup } from "@mui/material";
import { ReactNode } from "react";

const themeIcon: Record<ThemeType, ReactNode> = {
	[ThemeType.Dark]: <DarkMode />,
	[ThemeType.System]: <AutoMode />,
	[ThemeType.Light]: <LightMode />,
};

interface ThemeSwitchProps {
	theme: ThemeType;
}
function ThemeSwtich(props: ThemeSwitchProps) {
	const { theme, setTheme } = useLocalPreferences();

	return (
		<Button
			variant={theme === props.theme ? "contained" : "outlined"}
			size="small"
			sx={{ aspectRatio: "1/1" }}
			onClick={() => setTheme(props.theme)}
		>
			{themeIcon[props.theme]}
		</Button>
	);
}

export default function ThemeSwitches() {
	return (
		<ButtonGroup>
			<ThemeSwtich theme={ThemeType.Dark} />
			<ThemeSwtich theme={ThemeType.System} />
			<ThemeSwtich theme={ThemeType.Light} />
		</ButtonGroup>
	);
}
