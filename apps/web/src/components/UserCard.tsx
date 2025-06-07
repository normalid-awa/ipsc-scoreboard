import {
	Avatar,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
} from "@mui/material";
import { MouseEventHandler } from "react";

export interface UserCardProps {
	name: string;
	avatar?: string;
	onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function UserCard(props: UserCardProps) {
	return (
		<ListItem disablePadding>
			<ListItemButton sx={{ pl: 1.5, py: 2 }} onClick={props.onClick}>
				<ListItemAvatar
					sx={{ minWidth: 0, justifyContent: "center", mr: 3 }}
				>
					<Avatar alt={props.name} src={props.avatar ?? props.name} />
				</ListItemAvatar>
				<ListItemText primary={props.name} />
			</ListItemButton>
		</ListItem>
	);
}
