import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactElement } from "react";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

export interface ExpandMoreButtonProps extends IconButtonProps {
	icon?: ReactElement;
	expanded: boolean;
}

export function ExpandMoreButton(props: ExpandMoreButtonProps) {
	const theme = useTheme();
	return (
		<IconButton {...props}>
			<Box
				sx={{
					rotate: props.expanded ? "180deg" : "0deg",
					transition: theme.transitions.create(["rotate"], {
						easing: theme.transitions.easing.easeInOut,
						duration: theme.transitions.duration.standard,
					}),
					display: "flex",
					alignContent: "center",
					justifyContent: "center",
				}}
			>
				{props.icon || <ExpandMoreIcon />}
			</Box>
		</IconButton>
	);
}
