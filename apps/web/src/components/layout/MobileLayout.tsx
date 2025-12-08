import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { UserCard } from "../UserCard";
import AppTopBar from "./AppTopBar";
import { LayoutProps } from "./Layout";
import NavBar from "./NavBar";

function HideOnScroll(props: { children: React.ReactElement<unknown> }) {
	const { children } = props;
	const trigger = useScrollTrigger();

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	);
}

export default function MobileLayout(props: LayoutProps) {
	return (
		<>
			<SwipeableDrawer
				open={props.fold}
				onClose={() => props.setFold(false)}
				onOpen={() => props.setFold(true)}
				sx={{ width: 200 }}
			>
				<Toolbar />
				<NavBar
					topItems={[
						<Box sx={{ flexGrow: 1 }}>
							<UserCard sx={{ p: 2 }} />
						</Box>,
						<Box sx={{ my: 1 }} />,
					]}
				/>
			</SwipeableDrawer>
			<HideOnScroll>
				<AppTopBar
					fold={props.fold}
					setFold={props.setFold}
					mobileLayout
				/>
			</HideOnScroll>
			<Paper sx={{ p: 1, minHeight: "100vh" }}>
				<Toolbar />
				{props.children}
			</Paper>
		</>
	);
}
