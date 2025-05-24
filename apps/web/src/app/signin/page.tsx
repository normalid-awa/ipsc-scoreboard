"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { GitHub, Google } from "@mui/icons-material";
import { Button, CircularProgress, Modal, Stack } from "@mui/material";
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
			Continue with{" "}
			{props.provider.at(0)?.toUpperCase() + props.provider.slice(1)}
		</Button>
	);
}

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const { signIn } = useAuthActions();

	const handleProviderSignIn = (value: Provider) => () => {
		setLoading(true);
		signIn(value).finally(() => {
			setLoading(false);
		});
	};

	return (
		<div>
			<Modal open={loading}>
				<CircularProgress />
			</Modal>
			<Stack>
				<OAuthLoginButton
					provider="github"
					signIn={handleProviderSignIn}
				/>
				<OAuthLoginButton
					provider="google"
					signIn={handleProviderSignIn}
				/>
			</Stack>
		</div>
	);
}
