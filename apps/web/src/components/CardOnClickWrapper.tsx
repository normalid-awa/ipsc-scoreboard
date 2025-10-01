import CardActionArea from "@mui/material/CardActionArea";
import { ReactNode } from "react";

export function CardOnClickWrapper(props: {
	onClick?: () => void;
	children: ReactNode;
}) {
	return props.onClick ? (
		<CardActionArea onClick={props.onClick}>
			{props.children}
		</CardActionArea>
	) : (
		props.children
	);
}
