import { UserCard } from "../UserCard";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";

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
					props.mobileLayout
						? theme.zIndex.drawer
						: theme.zIndex.drawer + 1,
			}}
		>
			<Toolbar>
				<IconButton
					edge="start"
					color="inherit"
					sx={{ mr: 2 }}
					onClick={() => props.setFold(!props.fold)}
				>
					{props.fold ? <MenuOpenIcon /> : <MenuIcon />}
				</IconButton>
				<Typography variant="h6" sx={{ flexGrow: 1 }}>
					IPSC Scoreboard
				</Typography>
				{!props.mobileLayout && <UserCard sx={{ p: 1 }} />}
			</Toolbar>
		</AppBar>
	);
}
