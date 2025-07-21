import { authClient } from "@/auth/auth.client";
import { useLocation } from "@tanstack/react-router";
import { ReactElement, useRef } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import GithubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";

function OAuthButton(props: {
	icon: ReactElement;
	label: string;
	provider: string;
}) {
	return (
		<Button
			variant="outlined"
			size="large"
			startIcon={props.icon}
			onClick={() =>
				authClient.signIn.social({
					provider: props.provider,
					callbackURL: window.location.href,
				})
			}
		>
			{props.label}
		</Button>
	);
}

export default function LoginForm() {
	const { href } = useLocation();
	const formRef = useRef<HTMLFormElement>(null);

	const handleEmailLogin = async (email: string, password: string) => {
		const { data, error } = await authClient.signIn.email(
			{
				/**
				 * The user email
				 */
				email,
				/**
				 * The user password
				 */
				password,
				/**
				 * A URL to redirect to after the user verifies their email (optional)
				 */
				callbackURL: href,
				/**
				 * remember the user session after the browser is closed.
				 * @default true
				 */
				rememberMe: false,
			},
			{
				//callbacks
			},
		);
		if (error) {
			for (const ele of formRef.current?.getElementsByTagName?.("input") ||
				[]) {
				ele.setCustomValidity(error.message || "Invalid input");
				ele.reportValidity();
			}
		}
	};

	return (
		<>
			<Stack divider={<Divider />} spacing={2}>
				<Stack spacing={2}>
					<Typography variant="h5" textAlign={"center"}>
						3-rd Party Login
					</Typography>
					<OAuthButton icon={<GithubIcon />} label="Github" provider="github" />
					<OAuthButton icon={<GoogleIcon />} label="Google" provider="google" />
					<OAuthButton
						icon={<MicrosoftIcon />}
						label="Microsoft"
						provider="microsoft"
					/>
				</Stack>
				<Stack
					component={"form"}
					ref={formRef}
					spacing={2}
					onSubmit={(e) => {
						e.preventDefault();
						const formData = new FormData(e.target as HTMLFormElement);
						handleEmailLogin(
							formData.get("email") as string,
							formData.get("password") as string,
						);
					}}
				>
					<Typography variant="h5" textAlign="center">
						Email Login
					</Typography>
					<TextField
						required
						autoComplete="login-email"
						name="email"
						label="Email"
						type="email"
					/>
					<TextField
						required
						autoComplete="login-password"
						name="password"
						label="Password"
						type="password"
					/>
					<Tooltip title="Keep login even you close the browser" followCursor>
						<FormControlLabel
							label="Remember me"
							control={
								<Checkbox size="small" sx={{ p: 0, mr: 1 }} defaultChecked />
							}
						/>
					</Tooltip>
					<ButtonGroup fullWidth>
						<Button variant="outlined" size="large">
							Sign up
						</Button>
						<Button variant="contained" size="large" type="submit">
							Login
						</Button>
					</ButtonGroup>
				</Stack>
			</Stack>
		</>
	);
}
