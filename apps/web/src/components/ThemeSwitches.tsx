import { useLocalPreferences } from "@/providers/localPreferences/LocalPreferencesProvider";
import { Theme } from "@/providers/localPreferences/settings/theme.setting";
import { AutoMode, DarkMode, LightMode } from "@mui/icons-material";
import { Button, ButtonGroup, useColorScheme } from "@mui/material";
import { ReactNode } from "react";

const themeIcon: Record<Theme, ReactNode> = {
	dark: <DarkMode />,
	system: <AutoMode />,
	light: <LightMode />,
};

interface ThemeSwitchProps {
	mode: Theme;
}
function ThemeSwtich(props: ThemeSwitchProps) {
	const { mode } = useColorScheme();
	const { set } = useLocalPreferences();

	return (
		<Button
			variant={mode === props.mode ? "contained" : "outlined"}
			size="small"
			sx={{ aspectRatio: "1/1" }}
			onClick={() => set("theme", props.mode)}
		>
			{themeIcon[props.mode]}
		</Button>
	);
}

export default function ThemeSwitches() {
	return (
		<ButtonGroup>
			<ThemeSwtich mode="dark" />
			<ThemeSwtich mode="system" />
			<ThemeSwtich mode="light" />
		</ButtonGroup>
	);
}
