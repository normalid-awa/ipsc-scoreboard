import { Sport } from "@ipsc_scoreboard/api";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

export interface ShooterCardProps {
	identifier: string;
	sport: Sport;
	icon?: string;
	onClick?: () => void;
	size?: "small" | "medium" | "large";
}

const ListItemWrapper = (props: {
	children: ReactNode;
	onClick?: () => void;
}) =>
	props.onClick ? (
		<ListItemButton onClick={props.onClick} disableGutters sx={{ p: 0 }}>
			<ListItem>{props.children}</ListItem>
		</ListItemButton>
	) : (
		<ListItem>{props.children}</ListItem>
	);

export function ShooterCard(props: ShooterCardProps) {
	const avatarSize =
		props.size === "small"
			? 24
			: props.size === "medium"
				? 48
				: props.size === "large"
					? 64
					: 24;

	return (
		<Paper>
			<ListItemWrapper onClick={props.onClick}>
				<ListItemAvatar>
					<Avatar
						sx={{
							height: avatarSize,
							width: avatarSize,
							mr: avatarSize / 20,
						}}
						src={props.icon}
					/>
				</ListItemAvatar>
				<ListItemText
					primary={
						<Typography
							variant={
								props.size === "small"
									? "h6"
									: props.size === "medium"
										? "h5"
										: props.size === "large"
											? "h4"
											: "h6"
							}
						>
							{props.identifier}
						</Typography>
					}
					secondary={
						<Typography
							variant={
								props.size === "small"
									? "caption"
									: props.size === "medium"
										? "body1"
										: props.size === "large"
											? "h6"
											: "body2"
							}
						>
							{props.sport}
						</Typography>
					}
				/>
			</ListItemWrapper>
		</Paper>
	);
}
