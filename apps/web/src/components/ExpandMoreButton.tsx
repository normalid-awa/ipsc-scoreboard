import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactElement } from "react";
import { useTheme } from "@mui/material/styles";
import Icon from "@mui/material/Icon";

export interface ExpandMoreButtonProps extends IconButtonProps {
	icon?: ReactElement;
	expanded: boolean;
}

export function ExpandMoreButton(props: ExpandMoreButtonProps) {
	const theme = useTheme();
	return (
		<IconButton {...props}>
			<Icon
				color={props.expanded ? "secondary" : "inherit"}
				sx={{
					transform: props.expanded
						? "rotateX(180deg)"
						: "rotateX(0deg)",
					transition: theme.transitions.create(["transform"], {
						easing: theme.transitions.easing.easeInOut,
						duration: theme.transitions.duration.standard,
					}),
					display: "flex",
					alignContent: "center",
					justifyContent: "center",
				}}
			>
				{props.icon || <ExpandMoreIcon />}
			</Icon>
		</IconButton>
	);
}
