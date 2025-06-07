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
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import UserCard from "../UserCard";
import { api } from "@ipsc-scoreboard/backend/convex/_generated/api.js";

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
			<ListItemButton onClick={props.navTo(props.path)} sx={{ pl: 2.5 }}>
				<ListItemIcon
					sx={{
						minWidth: 0,
						justifyContent: "center",
						mr: 4,
					}}
				>
					{props.icon}
				</ListItemIcon>
				<ListItemText primary={props.name} />
			</ListItemButton>
		</ListItem>
	);
}

export default function RouteList(props: RouteListProps) {
	const { isAuthenticated } = useConvexAuth();
	const { signOut } = useAuthActions();
	const identity = useQuery(api.users.getAuthUserInfo);

	return (
		<Stack
			justifyContent={"space-between"}
			sx={{ height: "100%" }}
			divider={<Divider />}
		>
			<div>
				<UserCard
					avatar={identity?.avatar}
					name={identity?.name || "Guest"}
				/>
				<Divider />
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
			</div>
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
