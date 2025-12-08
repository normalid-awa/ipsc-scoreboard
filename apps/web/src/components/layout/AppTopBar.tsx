import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { forwardRef } from "react";
import { UserCard } from "../UserCard";

export interface AppTopBarProps {
	fold: boolean;
	setFold: (fold: boolean) => void;
	mobileLayout?: boolean;
}

export default forwardRef<HTMLElement, AppTopBarProps>(
	(props: AppTopBarProps, ref) => {
		return (
			<AppBar
				ref={ref}
				position="fixed"
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
	},
);
