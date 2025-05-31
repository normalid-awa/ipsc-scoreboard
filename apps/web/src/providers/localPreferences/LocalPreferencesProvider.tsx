"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { ThemeSetting } from "./settings/theme.setting";

export type OnPrefrenceChangeEventType = `preference:${string}:change`;

export interface Preference<T> {
	name: string;
	defaultValue: T;
	getInitialValue: () => T;
	onChange: (value: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preferences: Preference<any>[] = [new ThemeSetting()];

export const onPreferenceChangeEventType = (
	name: string,
): OnPrefrenceChangeEventType => `preference:${name}:change`;

const LocalPreferencesContext = createContext<{
	get: <T>(key: string) => T;
	set: <T>(key: string, value: T) => void;
}>(null!);

export function useLocalPreferences() {
	return useContext(LocalPreferencesContext);
}

export function LocalPreferencesProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [preferencesState, setPreferencesState] = useState<{
		[key: string]: unknown;
	}>({});

	useEffect(() => {
		preferences.forEach((preference) => {
			const initialValue = preference.getInitialValue();
			setPreferencesState((prev) => ({
				...prev,
				[preference.name]: initialValue,
			}));
		});
	}, []);

	function get<T>(key: string): T {
		return preferencesState[key] as T;
	}

	function set<T>(key: string, value: T) {
		preferences
			.find((preference) => preference.name === key)
			?.onChange(value);
		dispatchEvent(
			new CustomEvent(
				`preference:${key}:change` satisfies OnPrefrenceChangeEventType,
				{
					detail: value,
				},
			),
		);
		setPreferencesState((prev) => ({ ...prev, [key]: value }));
	}

	return (
		<LocalPreferencesContext.Provider value={{ get, set }}>
			{children}
		</LocalPreferencesContext.Provider>
	);
}
