import { createContext, useContext } from "react";

const ScrollTargetContext = createContext<Element | null>(null);

/**
 *
 * @param props Props with children, also the target of scroll
 */
export function ScrollTargetProvider(props: {
	ref: Element | null;
	children: React.ReactNode;
}) {
	return (
		<ScrollTargetContext.Provider value={props.ref}>
			{props.children}
		</ScrollTargetContext.Provider>
	);
}

export function useScrollTarget() {
	return useContext(ScrollTargetContext);
}
