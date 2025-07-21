import React from "react";
import { createLink } from "@tanstack/react-router";
import type { LinkComponent } from "@tanstack/react-router";
import type { LinkProps } from "@mui/material/Link";
import type { ButtonProps } from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import MuiButton from "@mui/material/Button";

interface MUILinkProps extends LinkProps {
	// Add any additional props you want to pass to the Link
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, MUILinkProps>(
	(props, ref) => <MuiLink ref={ref} {...props} />,
);

const CreatedLinkComponent = createLink(MUILinkComponent);

export const Link: LinkComponent<typeof MUILinkComponent> = (props) => {
	return <CreatedLinkComponent preload={"intent"} {...props} />;
};

interface MUIButtonLinkProps extends ButtonProps<"a"> {
	// Add any additional props you want to pass to the Button
}

const MUIButtonLinkComponent = React.forwardRef<
	HTMLAnchorElement,
	MUIButtonLinkProps
>((props, ref) => <MuiButton ref={ref} component="a" {...props} />);

const CreatedButtonLinkComponent = createLink(MUIButtonLinkComponent);

export const ButtonLink: LinkComponent<typeof MUIButtonLinkComponent> = (
	props,
) => {
	return <CreatedButtonLinkComponent preload={"intent"} {...props} />;
};
