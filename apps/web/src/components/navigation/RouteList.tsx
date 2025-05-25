import { Route } from "@/app/routeList";
import { Route as NextRoute } from "next";
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";

export interface RouteListProps {
	routes: Route[];
	navTo: (path: NextRoute) => () => void;
	open: boolean;
}

export default function RouteList(props: RouteListProps) {
	return (
		<List>
			{props.routes.map((route) => {
				if (route.shouldBeShow && !route.shouldBeShow()) {
					return null;
				}
				return (
					<ListItem
						key={route.path}
						disablePadding
						sx={{ display: "block" }}
					>
						<ListItemButton
							onClick={props.navTo(route.path)}
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
								{route.icon}
							</ListItemIcon>
							<ListItemText
								primary={route.name}
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
			})}
		</List>
	);
}
