import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { InitColorSchemeScript } from "@mui/material";
import { THEME_PREFERENCE_KEY } from "@/providers/localPreferences/settings/theme.setting";

export default function LayoutServer({ children }: { children: ReactNode }) {
	return (
		<>
			<InitColorSchemeScript
				attribute="class"
				modeStorageKey={THEME_PREFERENCE_KEY}
			/>
			<AppRouterCacheProvider>{children} </AppRouterCacheProvider>
		</>
	);
}
