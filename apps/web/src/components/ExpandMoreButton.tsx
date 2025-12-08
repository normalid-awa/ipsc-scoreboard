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
	const { icon, expanded, ...iconProps } = props;

	return (
		<IconButton {...iconProps}>
			<Icon
				color={expanded ? "secondary" : "inherit"}
				sx={{
					transform: expanded ? "rotateX(180deg)" : "rotateX(0deg)",
					transition: theme.transitions.create(["transform"], {
						easing: theme.transitions.easing.easeInOut,
						duration: theme.transitions.duration.standard,
					}),
					display: "flex",
					alignContent: "center",
					justifyContent: "center",
				}}
			>
				{icon || <ExpandMoreIcon />}
			</Icon>
		</IconButton>
	);
}
