import {
	Divider,
	Icon,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
} from "@mui/material";
import { useRouter } from "@tanstack/react-router";
import { isRouteAListedRoute } from "../../router";
import { Link } from "../MuiWrapper";
import { ReactElement } from "react";

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
				{props.topItems}
				{props.topItems && <Divider />}
				{flatRoutes.map((route) => {
					if (!isRouteAListedRoute(route.options.staticData)) return <></>;
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
										bgcolor: (theme) => theme.palette.action.selected,
									},
								}}
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
								<ListItemText primary={route.options.staticData.displayName} />
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
