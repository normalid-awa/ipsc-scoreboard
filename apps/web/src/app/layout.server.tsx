import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

export default function LayoutServer({ children }: { children: ReactNode }) {
	return <AppRouterCacheProvider>{children} </AppRouterCacheProvider>;
}
