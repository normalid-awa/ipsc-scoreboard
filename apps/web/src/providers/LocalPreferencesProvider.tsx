"use client";

import { useColorScheme } from "@mui/material";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

export enum ThemeType {
	Dark = "dark",
	System = "system",
	Light = "light",
}

export interface LocalPreferencesContextType {
	theme: ThemeType;
	setTheme: (value: ThemeType) => void;
}

const LocalPreferencesContext = createContext<LocalPreferencesContextType>(
	null!,
);

export function useLocalPreferences() {
	return useContext(LocalPreferencesContext);
}

function initContextVariables<T>(
	key: string,
	defaultValue: T,
	reactSetter: (value: T) => void,
) {
	if (localStorage.getItem(key) === null) {
		localStorage.setItem(key, JSON.stringify(defaultValue));
		reactSetter(defaultValue);
	} else {
		const value = JSON.parse(localStorage.getItem(key)!) as T;
		reactSetter(value);
	}
}

export function LocalPreferencesProvider({
	children,
}: {
	children: ReactNode;
}) {
	const { setMode } = useColorScheme();
	const [theme, setTheme] = useState(ThemeType.System);

	useEffect(() => {
		initContextVariables("theme", ThemeType.System, setTheme);
	}, []);

	useEffect(() => {
		localStorage.setItem("theme", JSON.stringify(theme));
		setMode(theme);
	}, [theme, setMode]);

	return (
		<LocalPreferencesContext.Provider
			value={{
				theme,
				setTheme,
			}}
		>
			{children}
		</LocalPreferencesContext.Provider>
	);
}
