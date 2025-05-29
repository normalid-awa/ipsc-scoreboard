import { Circle, Menu } from "@mui/icons-material";
import {
	IconButton,
	Toolbar,
	Typography,
	AppBar as MuiAppBar,
	AppBarProps as MuiAppBarProps,
	styled,
	Grid,
} from "@mui/material";
import { drawerWidth } from "./NavigationLayout";
import { useTimer } from "@/providers/timer/TimerProvider";

interface StyledAppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const StyledAppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<StyledAppBarProps>(({ theme }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	variants: [
		{
			props: ({ open }) => open,
			style: {
				marginLeft: drawerWidth,
				width: `calc(100% - ${drawerWidth}px)`,
				transition: theme.transitions.create(["width", "margin"], {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.enteringScreen,
				}),
			},
		},
	],
}));

export interface AppBarProps {
	open: boolean;
	onClick: () => void;
}

export default function AppBar(props: AppBarProps) {
	const { isConnected } = useTimer();

	return (
		<StyledAppBar open={props.open} position="fixed">
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					onClick={props.onClick}
					edge="start"
					sx={[
						{
							marginRight: 5,
						},
						props.open && { display: "none" },
					]}
				>
					<Menu />
				</IconButton>
				<Grid>
					<Grid size={12}>
						<Typography variant="h6" noWrap component="div">
							IPSC Scoreboard
						</Typography>
					</Grid>
					<Grid size={12}>
						<Typography
							variant="subtitle2"
							fontWeight={"200"}
							style={{ display: "inline-block" }}
						>
							Timer connectivity
						</Typography>
						<Circle
							style={{ float: "inline-end" }}
							color={isConnected ? "success" : "error"}
						/>
					</Grid>
				</Grid>
			</Toolbar>
		</StyledAppBar>
	);
}
