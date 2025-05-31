"use client";

import WideScreenNavigationLayout from "@/components/navigation/WideScreenNavigationLayout";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { ReactNode, useCallback, useEffect } from "react";
import { routes } from "./routeList";
import { Route } from "next";
import { useRouter } from "next/navigation";
import {
	CssBaseline,
	ThemeProvider,
	useColorScheme,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import MobileNavigationLayout from "@/components/navigation/MobileNavigationLayout";
import {
	LocalPreferencesProvider,
	onPreferenceChangeEventType,
} from "@/providers/localPreferences/LocalPreferencesProvider";
import globalTheme from "../theme";
import { TimerProvider } from "@/providers/timer/TimerProvider";
import {
	Theme,
	THEME_PREFERENCE_KEY,
} from "@/providers/localPreferences/settings/theme.setting";

function ColorSchemeUpdateService() {
	const { setMode } = useColorScheme();
	const updateTheme = useCallback(
		(value: Theme) => {
			setMode(value);
		},
		[setMode],
	);

	useEffect(() => {
		addEventListener(
			onPreferenceChangeEventType("theme"),
			(e: CustomEventInit<Theme>) => updateTheme(e.detail!),
		);
		return () => {
			removeEventListener(
				onPreferenceChangeEventType("theme"),
				(e: CustomEventInit<Theme>) => updateTheme(e.detail!),
			);
		};
	}, [updateTheme]);

	return <></>;
}

export default function LayoutClient({ children }: { children: ReactNode }) {
	const router = useRouter();
	const theme = useTheme();
	const mobileLayout = useMediaQuery(theme.breakpoints.down("sm"));

	const navTo = (path: Route) => () => {
		router.push(path);
	};

	return (
		<ThemeProvider
			theme={globalTheme}
			modeStorageKey={THEME_PREFERENCE_KEY}
		>
			<LocalPreferencesProvider>
				<ConvexClientProvider>
					<TimerProvider>
						<CssBaseline enableColorScheme />
						<ColorSchemeUpdateService />
						{mobileLayout ? (
							<MobileNavigationLayout
								routes={routes}
								navTo={navTo}
							>
								{children}
							</MobileNavigationLayout>
						) : (
							<WideScreenNavigationLayout
								routes={routes}
								navTo={navTo}
							>
								{children}
							</WideScreenNavigationLayout>
						)}
					</TimerProvider>
				</ConvexClientProvider>
			</LocalPreferencesProvider>
		</ThemeProvider>
	);
}
