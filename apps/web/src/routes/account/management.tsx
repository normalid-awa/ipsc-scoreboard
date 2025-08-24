import {
	authClient,
	AuthProtectedComponent,
	useSession,
} from "@/auth/auth.client";
import {
	useListAccounts,
	useListSessions,
	useRevokeSession,
	useUpdateUser,
} from "@/auth/auth.hooks";
import { createFileRoute } from "@tanstack/react-router";
import { confirm } from "material-ui-confirm";
import { ReactElement, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper, { PaperProps } from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import env from "@/env";

export const Route = createFileRoute("/account/management")({
	component: () => <AuthProtectedComponent component={<RouteComponent />} />,
	head: () => ({
		meta: [{ title: `${env.VITE_TITLE_PREFIX} Account Management` }],
	}),
});

function AccountInfo() {
	const { data } = useSession();
	const { mutate: updateUser } = useUpdateUser();
	const [editDialogOpen, setEditDialogOpen] = useState(false);

	return (
		<>
			<Dialog
				open={editDialogOpen}
				onClose={() => setEditDialogOpen(false)}
				component={"form"}
				onReset={() => setEditDialogOpen(false)}
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.target as HTMLFormElement);
					updateUser({
						name: formData.get("name") as string,
					});
					setEditDialogOpen(false);
				}}
			>
				<DialogTitle>Edit Account Info</DialogTitle>
				<Divider />
				<DialogContent>
					<TextField
						label="Name"
						name="name"
						defaultValue={data?.user.name}
						required
					/>
				</DialogContent>
				<Divider />
				<DialogActions>
					<Button type="reset">Cancel</Button>
					<Button type="submit">Save</Button>
				</DialogActions>
			</Dialog>
			<Typography variant="h5" sx={{ mb: 2 }}>
				Account info
			</Typography>
			<Paper variant="outlined" sx={{ p: 2 }}>
				<Fab
					sx={{ float: "right" }}
					color="primary"
					variant="extended"
					onClick={() => setEditDialogOpen(true)}
				>
					<EditIcon />
					Edit info
				</Fab>
				<Grid container rowSpacing={2}>
					<Grid size={{ xs: 12, sm: "auto" }}>
						<Avatar
							sx={{ height: "8rem", width: "8rem", mr: 5 }}
							src={data?.user.image || ""}
						/>
					</Grid>
					<Grid
						size={{ xs: 12, sm: "grow" }}
						container
						sx={{ flexGrow: 1 }}
					>
						<Grid size={12}>
							<Typography variant="h5">
								{data?.user.name}
							</Typography>
						</Grid>
						<Grid size={12}>
							<Typography variant="body1">
								Email: {data?.user.email}
							</Typography>
							<Typography variant="body1">
								Username: {data?.user.username || "N/A"}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Paper>
		</>
	);
}

function ThirdPartyLinkButton(props: {
	icon: ReactElement;
	label: string;
	provider: string;
}) {
	const [hovered, setHovered] = useState(false);
	const accounts = useListAccounts();
	const linked = useMemo(
		() =>
			accounts.data?.findIndex((x) => x.provider === props.provider) !==
			-1,
		[accounts.data],
	);

	function link() {
		authClient.linkSocial({
			provider: props.provider,
			callbackURL: window.location.href,
		});
	}

	async function unlink() {
		const { confirmed } = await confirm({
			description: `Are you sure you want to unlink your ${props.label} account?`,
		});
		if (!confirmed) return;

		const { error } = await authClient.unlinkAccount({
			providerId: props.provider,
		});
		if (error) {
			confirm({
				title: "Error",
				description: error.message,
				hideCancelButton: true,
			});
			return;
		}
		accounts.refetch();
	}

	return (
		<Button
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			variant={linked ? "outlined" : "contained"}
			color={linked ? (hovered ? "error" : "success") : "primary"}
			sx={{
				flexGrow: 1,
				py: 4,
				height: 120,
			}}
			size="large"
			onClick={linked ? unlink : link}
		>
			{hovered && linked ? (
				<Typography>Unlink {props.icon} account</Typography>
			) : (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					{props.icon}
					<Typography variant="button">{props.label}</Typography>
					{linked && (
						<Box sx={{ display: "flex", alignItems: "center" }}>
							{<CheckIcon />}
							<Typography>Linked</Typography>
						</Box>
					)}
				</Box>
			)}
		</Button>
	);
}

function ThirdPartyLinks() {
	return (
		<>
			<Typography variant="h5" sx={{ mb: 2 }}>
				Third-party Links
			</Typography>
			<Stack
				direction={"row"}
				justifyContent={"space-around"}
				spacing={2}
			>
				<ThirdPartyLinkButton
					icon={<GitHubIcon fontSize="large" />}
					label="Github"
					provider="github"
				/>
				<ThirdPartyLinkButton
					icon={<GoogleIcon fontSize="large" />}
					label="Google"
					provider="google"
				/>
				<ThirdPartyLinkButton
					icon={<MicrosoftIcon fontSize="large" />}
					label="Microsoft"
					provider="microsoft"
				/>
			</Stack>
		</>
	);
}

function SessionDevices() {
	const { data } = useListSessions();
	const { mutate: revokeSession } = useRevokeSession();

	const revoke = (token: string) => async () => {
		revokeSession({ token });
	};

	return (
		<>
			<Typography variant="h5" sx={{ mb: 2 }}>
				Session Devices
			</Typography>
			<Stack divider={<Divider />}>
				{data?.map((device) => (
					<ListItem
						disablePadding
						key={device.id}
						secondaryAction={
							<IconButton onClick={revoke(device.token)}>
								<DeleteIcon />
							</IconButton>
						}
					>
						<Paper>{device.userAgent}</Paper>
					</ListItem>
				))}
			</Stack>
		</>
	);
}

function SettingBlock(props: PaperProps) {
	return <Paper {...props} elevation={3} sx={{ p: 2 }} />;
}

function RouteComponent() {
	return (
		<>
			<Container maxWidth="md">
				<h1>Account Management</h1>
				<Stack divider={<Divider />} spacing={2}>
					<SettingBlock>
						<AccountInfo />
					</SettingBlock>
					<SettingBlock>
						<ThirdPartyLinks />
					</SettingBlock>
					<SettingBlock>
						<SessionDevices />
					</SettingBlock>
				</Stack>
			</Container>
		</>
	);
}
