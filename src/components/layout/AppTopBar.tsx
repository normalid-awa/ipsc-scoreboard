import {
	AppBar,
	Box,
	Card,
	IconButton,
	Toolbar,
	Typography,
} from "@mui/material";
import { Menu, MenuOpen } from "@mui/icons-material";
import { UserCard } from "../UserCard";

export interface AppTopBarProps {
	fold: boolean;
	setFold: (fold: boolean) => void;
	mobileLayout?: boolean;
}

export default function AppTopBar(props: AppTopBarProps) {
	return (
		<AppBar
			position={props.mobileLayout ? "relative" : "fixed"}
			sx={{
				zIndex: (theme) =>
					props.mobileLayout ? theme.zIndex.drawer : theme.zIndex.drawer + 1,
			}}
		>
			<Toolbar>
				<IconButton
					edge="start"
					color="inherit"
					sx={{ mr: 2 }}
					onClick={() => props.setFold(!props.fold)}
				>
					{props.fold ? <MenuOpen /> : <Menu />}
				</IconButton>
				<Typography variant="h6" sx={{ flexGrow: 1 }}>
					IPSC Scoreboard
				</Typography>
				{!props.mobileLayout && <UserCard sx={{ p: 1 }} />}
			</Toolbar>
		</AppBar>
	);
}
