import { Paper, SwipeableDrawer, Toolbar, useTheme } from "@mui/material";
import { drawerWidth, NavigationLayoutProps } from "./NavigationLayout";
import { useState } from "react";
import AppBar from "./AppBar";
import RouteList from "./RouteList";

export default function MobileNavigationLayout(props: NavigationLayoutProps) {
	const theme = useTheme();
	const [open, setOpen] = useState(false);

	const setOpenCurried = (open: boolean) => () => setOpen(open);

	return (
		<div>
			<SwipeableDrawer
				anchor={theme.direction === "rtl" ? "right" : "left"}
				open={open}
				onClose={setOpenCurried(false)}
				onOpen={setOpenCurried(true)}
				slotProps={{
					paper: {
						sx: {
							width: drawerWidth,
						},
					},
				}}
			>
				<Toolbar />
				<RouteList
					routes={props.routes}
					open={true}
					navTo={props.navTo}
				/>
			</SwipeableDrawer>
			<AppBar open={false} onClick={setOpenCurried(!open)} />
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100vh",
				}}
			>
				<Toolbar />
				<Paper variant="outlined" sx={{ p: 1, m: 0.5, flexGrow: 1 }}>
					{props.children}
				</Paper>
			</div>
		</div>
	);
}
