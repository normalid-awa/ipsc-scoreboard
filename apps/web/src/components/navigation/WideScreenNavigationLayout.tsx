import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
	Box,
	CSSObject,
	IconButton,
	styled,
	Theme,
	Drawer as MuiDrawer,
	useTheme,
	Divider,
	Paper,
} from "@mui/material";
import { useState } from "react";
import { drawerWidth, NavigationLayoutProps } from "./NavigationLayout";
import AppBar from "./AppBar";
import RouteList from "./RouteList";

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	variants: [
		{
			props: ({ open }) => open,
			style: {
				...openedMixin(theme),
				"& .MuiDrawer-paper": openedMixin(theme),
			},
		},
		{
			props: ({ open }) => !open,
			style: {
				...closedMixin(theme),
				"& .MuiDrawer-paper": closedMixin(theme),
			},
		},
	],
}));

export default function WideScreenNavigationLayout(
	props: NavigationLayoutProps,
) {
	const theme = useTheme();
	const [open, setOpen] = useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			<AppBar open={open} onClick={handleDrawerOpen} />
			<Drawer variant="permanent" open={open}>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "rtl" ? (
							<ChevronRight />
						) : (
							<ChevronLeft />
						)}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<RouteList
					routes={props.routes}
					navTo={props.navTo}
					open={open}
				/>
			</Drawer>
			<Box
				component="main"
				sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
			>
				<DrawerHeader />
				<Paper
					variant="outlined"
					sx={{
						p: 2,
						m: 1,
						height: "100%",
					}}
				>
					{props.children}
				</Paper>
			</Box>
		</Box>
	);
}
