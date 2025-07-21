import { authClient, AuthProtectedComponent } from "@/auth.client";
import { useListAccounts } from "@/auth.hooks";
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

export const Route = createFileRoute("/account/management")({
	component: () => <AuthProtectedComponent component={<RouteComponent />} />,
});

function ThirdPartyLinkButton(props: {
	icon: ReactElement;
	label: string;
	provider: string;
}) {
	const [hovered, setHovered] = useState(false);
	const accounts = useListAccounts();
	const linked = useMemo(
		() => accounts.data?.findIndex((x) => x.provider === props.provider) !== -1,
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
			<Stack direction={"row"} justifyContent={"space-around"} spacing={2}>
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
						<ThirdPartyLinks />
					</SettingBlock>
				</Stack>
			</Container>
		</>
	);
}
