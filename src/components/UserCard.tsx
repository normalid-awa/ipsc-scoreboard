import { authClient, useSession } from "@/auth.client";
import { Login, Logout } from "@mui/icons-material";
import {
	Avatar,
	Card,
	CardActionArea,
	CardActionAreaProps,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	ListItem,
	ListItemIcon,
	Menu,
	MenuItem,
	Skeleton,
	Typography,
} from "@mui/material";
import { useState } from "react";
import LoginForm from "./LoginForm";
import ModeSwitch from "./ModeSwitch";

interface MenuProps {
	closeMenu: () => void;
}

function GuestMenu(props: MenuProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<MenuItem onClick={() => setOpen(true)}>
				<ListItemIcon>
					<Login />
				</ListItemIcon>
				<Typography>Login</Typography>
			</MenuItem>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle>Login</DialogTitle>
				<DialogContent>
					<LoginForm />
				</DialogContent>
			</Dialog>
		</>
	);
}

function UserMenu(props: MenuProps) {
	const { signOut } = authClient;

	return (
		<>
			<MenuItem
				onClick={() => {
					props.closeMenu();
					signOut();
				}}
			>
				<ListItemIcon>
					<Logout />
				</ListItemIcon>
				<Typography>Logout</Typography>
			</MenuItem>
		</>
	);
}

export function UserCard(props: CardActionAreaProps) {
	const [menuAnchorEl, setMenuAnchorEl] = useState<Element | null>(null);
	const { data, isPending } = useSession();

	if (isPending) {
		<Skeleton variant="rectangular" />;
	}

	const closeMenu = () => setMenuAnchorEl(null);
	const openMenu = (e: Element) => setMenuAnchorEl(e);

	return (
		<>
			<Card elevation={5} variant="outlined">
				<CardActionArea {...props} onClick={(e) => openMenu(e.currentTarget)}>
					<Grid container gap={2} alignItems={"center"}>
						<Grid size={"auto"}>
							<Avatar
								sx={{ boxShadow: (theme) => `${theme.shadows[5]}` }}
								src={data?.user.image || data?.user.name}
							/>
						</Grid>
						<Grid size={"grow"}>
							<Typography variant="h6">{data?.user.name ?? "Guest"}</Typography>
						</Grid>
					</Grid>
				</CardActionArea>
			</Card>
			<Menu
				open={Boolean(menuAnchorEl)}
				anchorEl={menuAnchorEl}
				onClose={closeMenu}
			>
				<ListItem>
					<ModeSwitch />
				</ListItem>
				{data?.user ? (
					<UserMenu closeMenu={closeMenu} />
				) : (
					<GuestMenu closeMenu={closeMenu} />
				)}
			</Menu>
		</>
	);
}
