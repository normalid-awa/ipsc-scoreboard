"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { GitHub, Google } from "@mui/icons-material";
import {
	Button,
	CircularProgress,
	Container,
	Divider,
	Modal,
	Stack,
	Typography,
} from "@mui/material";
import { useConvexAuth } from "convex/react";
import { ReactElement, useState } from "react";

type Provider = "github" | "google";
const ProviderIcons: Record<Provider, ReactElement> = {
	github: <GitHub />,
	google: <Google />,
};

interface OAuthLoginButtonProps {
	signIn: (provider: Provider) => () => void;
	provider: Provider;
}

function OAuthLoginButton(props: OAuthLoginButtonProps) {
	return (
		<Button
			variant="outlined"
			onClick={props.signIn(props.provider)}
			size="large"
			startIcon={ProviderIcons[props.provider]}
		>
			{props.provider.at(0)?.toUpperCase() + props.provider.slice(1)}
		</Button>
	);
}

export default function LoginPage() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const [loading, setLoading] = useState(false);
	const { signIn } = useAuthActions();

	const handleProviderSignIn = (value: Provider) => () => {
		setLoading(true);
		signIn(value).finally(() => {
			setLoading(false);
		});
	};

	if (isAuthenticated) {
		history.back();
	}

	return (
		<Container maxWidth="md" sx={{ height: "100%" }}>
			<Modal open={loading || isLoading}>
				<CircularProgress />
			</Modal>
			<Stack
				spacing={2}
				justifyContent={"center"}
				sx={{ height: "80%" /** -20% for visually centering */ }}
			>
				<Typography variant="h4" align="center">
					Sign in with
				</Typography>
				<Divider />
				<OAuthLoginButton
					provider="github"
					signIn={handleProviderSignIn}
				/>
				<OAuthLoginButton
					provider="google"
					signIn={handleProviderSignIn}
				/>
			</Stack>
		</Container>
	);
}
