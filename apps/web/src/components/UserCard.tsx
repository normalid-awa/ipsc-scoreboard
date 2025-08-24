import { authClient, useSession } from "@/auth/auth.client";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActionArea, {
	CardActionAreaProps,
} from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useState } from "react";
import LoginForm from "./LoginForm";
import ModeSwitch from "./ModeSwitch";
import { Link } from "./MuiWrapper";
import { confirm } from "material-ui-confirm";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface MenuProps {
	closeMenu: () => void;
}

function GuestMenu(props: MenuProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<MenuItem onClick={() => setOpen(true)}>
				<ListItemIcon>
					<LoginIcon />
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
			<Link underline="none" color="textPrimary" to="/account/management">
				<MenuItem onClick={() => props.closeMenu()}>
					<ListItemIcon>
						<AccountBoxIcon />
					</ListItemIcon>
					My Account
				</MenuItem>
			</Link>
			<MenuItem
				onClick={async () => {
					props.closeMenu();
					const { confirmed } = await confirm({
						description: "Are you sure you want to log out?",
					});
					if (confirmed) {
						const { data, error } = await signOut();
						if (error) {
							console.error(error);
							confirm({
								description: `[${error.code}] ${error.message}`,
								title: "Failed to log out.",
								hideCancelButton: true,
							});
						} else {
							confirm({
								description: "You have been logged out.",
								title: "Success",
								hideCancelButton: true,
							});
						}
					}
				}}
			>
				<ListItemIcon>
					<LogoutIcon />
				</ListItemIcon>
				<Typography>Logout</Typography>
			</MenuItem>
		</>
	);
}

export function UserCard(props: CardActionAreaProps) {
	const theme = useTheme();
	const mobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [menuAnchorEl, setMenuAnchorEl] = useState<Element | null>(null);
	const { data, isPending } = authClient.useSession();

	if (isPending) {
		<Skeleton variant="rectangular" />;
	}

	const closeMenu = () => setMenuAnchorEl(null);
	const openMenu = (e: Element) => setMenuAnchorEl(e);

	return (
		<>
			<Card elevation={5} variant="outlined">
				<CardActionArea
					{...props}
					onClick={(e) => openMenu(e.currentTarget)}
				>
					<Grid container gap={2} alignItems={"center"}>
						<Grid size={"auto"}>
							<Avatar
								sx={{
									boxShadow: (theme) => `${theme.shadows[5]}`,
								}}
								src={data?.user.image || data?.user.name}
							/>
						</Grid>
						<Grid size={"grow"}>
							<Typography variant="h6">
								{data?.user.name ?? "Guest"}
							</Typography>
						</Grid>
					</Grid>
				</CardActionArea>
			</Card>
			<Menu
				open={Boolean(menuAnchorEl)}
				anchorEl={menuAnchorEl}
				onClose={closeMenu}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: mobile ? "left" : "right",
				}}
				slotProps={{
					paper: {
						sx: {
							overflow: "visible",
							width: 300,
						},
					},
				}}
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
