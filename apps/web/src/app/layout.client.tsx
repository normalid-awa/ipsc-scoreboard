"use client";

import WideScreenNavigationLayout from "@/components/navigation/WideScreenNavigationLayout";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { ReactNode } from "react";
import { routes } from "./routeList";
import { Route } from "next";
import { useRouter } from "next/navigation";
import {
	CssBaseline,
	ThemeProvider,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import MobileNavigationLayout from "@/components/navigation/MobileNavigationLayout";
import { LocalPreferencesProvider } from "@/providers/LocalPreferencesProvider";
import globalTheme from "../theme";

export default function LayoutClient({ children }: { children: ReactNode }) {
	const router = useRouter();
	const theme = useTheme();
	const mobileLayout = useMediaQuery(theme.breakpoints.down("sm"));

	const navTo = (path: Route) => () => {
		router.push(path);
	};

	return (
		<ThemeProvider theme={globalTheme}>
			<LocalPreferencesProvider>
				<ConvexClientProvider>
					<CssBaseline />
					{mobileLayout ? (
						<MobileNavigationLayout routes={routes} navTo={navTo}>
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
				</ConvexClientProvider>
			</LocalPreferencesProvider>
		</ThemeProvider>
	);
}
