import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Menu, MenuOpen } from "@mui/icons-material";

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
				<Typography variant="h6">IPSC Scoreboard</Typography>
			</Toolbar>
		</AppBar>
	);
}
