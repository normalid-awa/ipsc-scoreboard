import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import { type QueryClient } from "@tanstack/react-query";
// import { getUserSession } from "@/auth/auth.api";

interface MyRouterContext {
	queryClient: QueryClient;
	// session: Awaited<ReturnType<typeof getUserSession>>;
}

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
	createTheme,
	CssBaseline,
	InitColorSchemeScript,
	ThemeProvider,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { ConfirmProvider } from "material-ui-confirm";
import { TimerProvider } from "@/providers/timer/TimerProvider";
import MobileLayout from "@/components/layout/MobileLayout";
import WideScreenLayout from "@/components/layout/WideScreenLayout";
import { ReactNode, useState } from "react";

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
				title: "IPSC Scoreboard",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	// async beforeLoad(ctx) {
	// 	return {
	// 		...ctx.context,
	// 		session: await getUserSession(),
	// 	} satisfies MyRouterContext;
	// },
	shellComponent: RootDocument,
});

const THEME_PREFERENCE_KEY = "mui-mode";

const theme = createTheme({
	colorSchemes: { light: true, dark: true },
	cssVariables: {
		colorSchemeSelector: "class",
	},
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<InitColorSchemeScript
					attribute="class"
					modeStorageKey={THEME_PREFERENCE_KEY}
				/>
				<main>
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
				</main>
				<TanstackDevtools
					config={{
						position: "bottom-left",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
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
