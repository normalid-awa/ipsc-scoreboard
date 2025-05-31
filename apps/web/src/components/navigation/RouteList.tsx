import { Route } from "@/app/routeList";
import { Route as NextRoute } from "next";
import {
	Divider,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Stack,
} from "@mui/material";
import { Login, Logout } from "@mui/icons-material";
import { ReactNode } from "react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export interface RouteListProps {
	routes: Route[];
	navTo: (path: NextRoute) => () => void;
	open: boolean;
}

function RouteItem(props: {
	name: string;
	icon: ReactNode;
	path: NextRoute;
	navTo: (path: NextRoute) => () => void;
	open: boolean;
}) {
	return (
		<ListItem key={props.path} disablePadding>
			<ListItemButton
				onClick={props.navTo(props.path)}
				sx={[
					{
						minHeight: 48,
						px: 2.5,
					},
					props.open
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
						props.open
							? {
									mr: 3,
								}
							: {
									mr: "auto",
								},
					]}
				>
					{props.icon}
				</ListItemIcon>
				<ListItemText
					primary={props.name}
					sx={[
						props.open
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
	);
}

export default function RouteList(props: RouteListProps) {
	const { isAuthenticated } = useConvexAuth();
	const { signOut } = useAuthActions();

	return (
		<Stack
			justifyContent={"space-between"}
			sx={{ height: "100%" }}
			divider={<Divider />}
		>
			<List>
				{props.routes.map((route) => {
					if (route.shouldBeShow && !route.shouldBeShow()) {
						return null;
					}
					return (
						<RouteItem
							key={route.path}
							name={route.name}
							icon={route.icon}
							path={route.path}
							navTo={props.navTo}
							open={props.open}
						/>
					);
				})}
			</List>
			<List>
				{isAuthenticated ? (
					<>
						<RouteItem
							icon={<Logout />}
							name="Sign Out"
							path="/"
							navTo={() => () => signOut()}
							open={props.open}
						/>
					</>
				) : (
					<RouteItem
						icon={<Login />}
						name="Sign In"
						path="/signin"
						navTo={props.navTo}
						open={props.open}
					/>
				)}
			</List>
		</Stack>
	);
}
