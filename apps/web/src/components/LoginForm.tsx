import { authClient } from "@/auth/auth.client";
import { useLocation } from "@tanstack/react-router";
import { ReactElement, useRef, useState } from "react";
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
import { confirm } from "material-ui-confirm";
import Dialog from "@mui/material/Dialog";
import { SignedUpForm } from "./SignedUpForm";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { Link } from "./MuiWrapper";

function OAuthButton(props: {
	icon: ReactElement;
	label: string;
	provider: string;
}) {
	const location = useLocation();
	return (
		<Button
			variant="outlined"
			size="large"
			startIcon={props.icon}
			onClick={async () => {
				await authClient.signIn.social({
					provider: props.provider,
					callbackURL: window.location.href,
					newUserCallbackURL: "/newUser?from=" + location.pathname,
				});
			}}
		>
			{props.label}
		</Button>
	);
}

export default function LoginForm() {
	const { href } = useLocation();
	const formRef = useRef<HTMLFormElement>(null);
	const [signUpFormOpen, setSignUpFormOpen] = useState(false);

	const handleEmailLogin = async (
		email: string,
		password: string,
		rememberMe: boolean,
	) => {
		const { error } = await authClient.signIn.email({
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
			rememberMe,
		});
		if (error) {
			for (const ele of formRef.current?.getElementsByTagName?.(
				"input",
			) || []) {
				confirm({
					description: error.message || "Invalid input",
					hideCancelButton: true,
				});
			}
		}
	};

	return (
		<>
			<Dialog
				onClose={() => setSignUpFormOpen(false)}
				open={signUpFormOpen}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>Sign up</DialogTitle>
				<DialogContent>
					<SignedUpForm />
				</DialogContent>
			</Dialog>
			<Stack divider={<Divider />} spacing={2}>
				<Stack spacing={2}>
					<Typography variant="h5" textAlign={"center"}>
						3-rd Party Login
					</Typography>
					<OAuthButton
						icon={<GithubIcon />}
						label="Github"
						provider="github"
					/>
					<OAuthButton
						icon={<GoogleIcon />}
						label="Google"
						provider="google"
					/>
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
						const formData = new FormData(
							e.target as HTMLFormElement,
						);
						console.log(formData.get("rememberMe"));
						handleEmailLogin(
							formData.get("email") as string,
							formData.get("password") as string,
							formData.get("rememberMe") == "on",
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
					<Tooltip
						title="Keep login even you close the browser"
						followCursor
					>
						<FormControlLabel
							name="rememberMe"
							label="Remember me"
							control={
								<Checkbox
									size="small"
									sx={{ p: 0, mr: 1 }}
									defaultChecked
								/>
							}
						/>
					</Tooltip>
					<ButtonGroup fullWidth>
						<Button
							variant="outlined"
							size="large"
							onClick={() => setSignUpFormOpen(true)}
						>
							Sign up
						</Button>
						<Button variant="contained" size="large" type="submit">
							Login
						</Button>
					</ButtonGroup>
					<Link to="/account/resetPassword">
						<Button fullWidth size="small">
							Forgot password?
						</Button>
					</Link>
				</Stack>
			</Stack>
		</>
	);
}
