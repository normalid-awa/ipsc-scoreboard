import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { InitColorSchemeScript } from "@mui/material";

export default function LayoutServer({ children }: { children: ReactNode }) {
	return (
		<>
			<InitColorSchemeScript attribute="class" />
			<AppRouterCacheProvider>{children} </AppRouterCacheProvider>;
		</>
	);
}
