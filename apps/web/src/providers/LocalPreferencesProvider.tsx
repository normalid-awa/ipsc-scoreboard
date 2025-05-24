"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

enum ThemeType {
	Dark,
	System,
	Light,
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
	const [theme, setTheme] = useState(ThemeType.System);

	useEffect(() => {
		initContextVariables("theme", ThemeType.System, setTheme);
	}, []);

	useEffect(() => {
		localStorage.setItem("theme", JSON.stringify(theme));
	}, [theme]);

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
