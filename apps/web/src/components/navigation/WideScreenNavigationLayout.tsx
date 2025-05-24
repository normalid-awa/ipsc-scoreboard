import { routes } from "@/app/routeList";
import { ChevronLeft, ChevronRight, Menu } from "@mui/icons-material";
import {
	Box,
	CssBaseline,
	CSSObject,
	IconButton,
	styled,
	Theme,
	Toolbar,
	Typography,
	AppBarProps as MuiAppBarProps,
	AppBar as MuiAppBar,
	Drawer as MuiDrawer,
	useTheme,
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

const drawerWidth = 240;

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

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
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

export interface WideScreenNavigationLayoutProps {
	children: ReactNode;
}

export default function WideScreenNavigationLayout(
	props: WideScreenNavigationLayoutProps,
) {
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const navTo = (path: string) => () => {
		router.push(path);
	};

	return (
		<Box sx={{ display: "flex", height: "100vh" }}>
			<CssBaseline />
			<AppBar position="fixed" open={open}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={[
							{
								marginRight: 5,
							},
							open && { display: "none" },
						]}
					>
						<Menu />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						Mini variant drawer
					</Typography>
				</Toolbar>
			</AppBar>
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
				<List>
					{routes.map((route) => (
						<ListItem
							key={route.path}
							disablePadding
							sx={{ display: "block" }}
						>
							<ListItemButton
								onClick={navTo(route.path)}
								sx={[
									{
										minHeight: 48,
										px: 2.5,
									},
									open
										? {
												justifyContent: "initial",
											}
										: {
												justifyContent: "center",
											},
								]}
							>
								<ListItemIcon
									sx={[
										{
											minWidth: 0,
											justifyContent: "center",
										},
										open
											? {
													mr: 3,
												}
											: {
													mr: "auto",
												},
									]}
								>
									{route.icon}
								</ListItemIcon>
								<ListItemText
									primary={route.name}
									sx={[
										open
											? {
													opacity: 1,
												}
											: {
													opacity: 0,
												},
									]}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
			<Box
				component="main"
				sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
			>
				<DrawerHeader />
				<Paper
					elevation={3}
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
