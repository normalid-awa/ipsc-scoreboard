import {
	Avatar,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
} from "@mui/material";

export interface UserCardProps {
	name: string;
	avatar?: string;
}

export default function UserCard(props: UserCardProps) {
	return (
		<ListItem disablePadding>
			<ListItemButton sx={{ pl: 1.5, py: 2 }}>
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
