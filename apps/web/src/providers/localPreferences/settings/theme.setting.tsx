import { Preference } from "../LocalPreferencesProvider";

export type Theme = "light" | "dark" | "system";
export const THEME_PREFERENCE_KEY = "preferences:theme-preference";

export class ThemeSetting implements Preference<Theme> {
	name = "theme";
	defaultValue: Theme = "system";
	getInitialValue = () => {
		return (
			(localStorage.getItem(THEME_PREFERENCE_KEY) as Theme) ||
			this.defaultValue
		);
	};
	onChange = (value: Theme) => {
		localStorage.setItem(THEME_PREFERENCE_KEY, value);
	};
}
