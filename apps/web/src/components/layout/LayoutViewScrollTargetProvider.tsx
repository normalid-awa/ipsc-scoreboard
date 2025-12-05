import { createContext, useContext } from "react";

const ScrollTargetContext = createContext<Element | null | undefined>(() => {
	if (document) return document.getElementsByTagName("html")[0];
	else return null;
});

/**
 *
 * @param props Props with children, also the target of scroll
 */
export function ScrollTargetProvider(props: {
	ref?: Element | null;
	children: React.ReactNode;
}) {
	return (
		<ScrollTargetContext.Provider value={props.ref || undefined}>
			{props.children}
		</ScrollTargetContext.Provider>
	);
}

export function useScrollTarget() {
	return useContext(ScrollTargetContext);
}
