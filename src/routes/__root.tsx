/// <reference types="vite/client" />
import { useState, type ReactNode } from "react";
import {
	Outlet,
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import useMediaQuery from "@mui/material/useMediaQuery";
import MobileLayout from "../components/layout/MobileLayout";
import WideScreenLayout from "../components/layout/WideScreenLayout";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { TimerProvider } from "@/providers/timer/TimerProvider";
import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfirmProvider } from "material-ui-confirm";
import { getUserSession } from "@/auth/auth.api";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export interface RouterContext {
	session: Awaited<ReturnType<typeof getUserSession>>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
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
	async beforeLoad(ctx) {
		return { session: await getUserSession() } satisfies RouterContext;
	},
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

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60,
		},
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
					<QueryClientProvider client={queryClient}>
						<AuthQueryProvider>
							<ThemeProvider
								theme={theme}
								modeStorageKey={THEME_PREFERENCE_KEY}
							>
								<CssBaseline enableColorScheme />
								<ConfirmProvider>
									<TimerProvider>
										<Layout>{children}</Layout>
									</TimerProvider>
								</ConfirmProvider>
							</ThemeProvider>
						</AuthQueryProvider>
					</QueryClientProvider>
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
