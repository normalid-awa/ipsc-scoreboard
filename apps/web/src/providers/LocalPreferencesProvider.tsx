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

interface PreferencesType {
	theme: ThemeType;
}

type Setters<Type> = {
	[Property in keyof Type as `set${Capitalize<string & Property>}`]: (
		value: Type[Property],
	) => void;
};
interface LocalPreferencesContextType
	extends PreferencesType,
		Setters<PreferencesType> {}

export const prefrencesDefaultValues: PreferencesType = {
	theme: ThemeType.System,
} as const;

const prefrencesItems: (keyof PreferencesType)[] = Object.keys(
	prefrencesDefaultValues,
) as (keyof PreferencesType)[];

const LocalPreferencesContext = createContext<LocalPreferencesContextType>(
	null!,
);

function getValue<T>(key: string, defaultValue: T) {
	if (localStorage.getItem(key) === null) {
		localStorage.setItem(key, JSON.stringify(defaultValue));
		return defaultValue;
	} else {
		return JSON.parse(localStorage.getItem(key)!) as T;
	}
}

export function useLocalPreferences() {
	return useContext(LocalPreferencesContext);
}

export function LocalPreferencesProvider({
	children,
}: {
	children: ReactNode;
}) {
	const { setMode } = useColorScheme();
	const [settings, setSettings] = useState<PreferencesType>(
		prefrencesDefaultValues,
	);

	useEffect(() => {
		let newSettings = {};
		for (const item of prefrencesItems) {
			newSettings = {
				...newSettings,
				[item]: getValue(item, prefrencesDefaultValues[item]),
			};
		}
		setSettings(newSettings as PreferencesType);
	}, []);

	useEffect(() => {
		for (const item of prefrencesItems) {
			localStorage.setItem(item, JSON.stringify(settings[item]));
		}
		setMode(settings.theme);
	}, [settings, setMode]);

	const setSettingCurried =
		(key: keyof PreferencesType) =>
		(value: PreferencesType[typeof key]) => {
			setSettings((prev) => ({
				...prev,
				[key]: value,
			}));
		};

	return (
		<LocalPreferencesContext.Provider
			value={{
				theme: settings.theme,
				setTheme: setSettingCurried("theme"),
			}}
		>
			{children}
		</LocalPreferencesContext.Provider>
	);
}
