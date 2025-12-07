import { useRouter } from "@tanstack/react-router";
import { isRouteAListedRoute } from "../../router";
import { Link } from "../MuiWrapper";
import { ReactElement } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Icon from "@mui/material/Icon";
import ListItemText from "@mui/material/ListItemText";

export interface NavBarProps {
	topItems?: ReactElement[];
	bottomItems?: ReactElement[];
}

export default function NavBar(props: NavBarProps) {
	const { flatRoutes } = useRouter();

	flatRoutes.sort((a, b) => {
		let a_data = a.options.staticData;
		let b_data = b.options.staticData;
		// due to a tyepscript bug, those check can't write in a single if statement with &&.
		if (!isRouteAListedRoute(a_data)) return 0;
		if (!isRouteAListedRoute(b_data)) return 0;
		if (a_data.order > b_data.order) return 1;
		if (a_data.order < b_data.order) return -1;
		return 0;
	});

	return (
		<>
			<List disablePadding sx={{ width: 250 }}>
				{props.topItems?.map((v) => {
					return (
						<ListItem
							disableGutters
							disablePadding
							key={v.key}
							sx={{ overflow: "auto" }}
						>
							{v}
						</ListItem>
					);
				})}
				{props.topItems && <Divider />}
				{flatRoutes.map((route) => {
					if (!isRouteAListedRoute(route.options.staticData))
						return null;
					return (
						<ListItem disableGutters disablePadding key={route.id}>
							<Link
								underline="hover"
								component={ListItemButton}
								key={route.id}
								to={route.to}
								sx={{
									color: "inherit",
									"&[data-status='active']": {
										bgcolor: (theme) =>
											theme.vars?.palette.Switch
												.infoDisabledColor,
									},
								}}
								viewTransition
							>
								<ListItemAvatar>
									<Icon
										fontSize="large"
										sx={{
											display: "flex",
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										{route.options.staticData.icon}
									</Icon>
								</ListItemAvatar>
								<ListItemText
									primary={
										route.options.staticData.displayName
									}
								/>
							</Link>
						</ListItem>
					);
				})}
				<Divider />
				{props.bottomItems}
			</List>
		</>
	);
}
