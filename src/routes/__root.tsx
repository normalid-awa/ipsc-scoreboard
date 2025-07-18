/// <reference types="vite/client" />
import { useState, type ReactNode } from "react";
import {
	Outlet,
	createRootRoute,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import CssBaseline from "@mui/material/CssBaseline";
import {
	createTheme,
	InitColorSchemeScript,
	ThemeProvider,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import MobileLayout from "../components/layout/MobileLayout";
import WideScreenLayout from "../components/layout/WideScreenLayout";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { TimerProvider } from "@/providers/timer/TimerProvider";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
			<TanStackRouterDevtools />
		</RootDocument>
	);
}

const THEME_PREFERENCE_KEY = "mui-mode";

const theme = createTheme({
	colorSchemes: { light: true, dark: true },
	cssVariables: {
		colorSchemeSelector: "class",
	},
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html>
			<head>
				<HeadContent />
				<Scripts />
			</head>
			<body style={{ margin: 0, padding: 0 }}>
				<InitColorSchemeScript
					attribute="class"
					modeStorageKey={THEME_PREFERENCE_KEY}
				/>
				<main>
					<ThemeProvider theme={theme} modeStorageKey={THEME_PREFERENCE_KEY}>
						<CssBaseline enableColorScheme />
						<TimerProvider>
							<Layout>{children}</Layout>
						</TimerProvider>
					</ThemeProvider>
				</main>
			</body>
		</html>
	);
}

function Layout({ children }: Readonly<{ children: ReactNode }>) {
	const theme = useTheme();
	const mobileLayout = useMediaQuery(theme.breakpoints.down("sm"));
	const [fold, setFold] = useState(false);

	return (
		<>
			{mobileLayout ? (
				<MobileLayout fold={fold} setFold={setFold}>
					{children}
				</MobileLayout>
			) : (
				<WideScreenLayout fold={fold} setFold={setFold}>
					{children}
				</WideScreenLayout>
			)}
		</>
	);
}
