import { authClient, useSession } from "@/auth/auth.client";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FormEvent, ReactElement, useState } from "react";
import GithubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { confirm } from "material-ui-confirm";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

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
					newUserCallbackURL: "/newUser?from=" + location.pathname,
				})
			}
		>
			{props.label}
		</Button>
	);
}

export function SignedUpForm() {
	const [expand, setExpand] = useState<"3rd-party" | "email">("3rd-party");

	async function emailSignUp(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);

		if (formData.get("password") !== formData.get("password-confirm")) {
			return confirm({
				title: "Error",
				description: "Passwords do not match",
				confirmationText: "Re-enter password",
				hideCancelButton: true,
			});
		}

		const { data: availabilityData } = await authClient.isUsernameAvailable(
			{
				username: formData.get("username") as string,
			},
		);

		if (!availabilityData?.available) {
			return confirm({
				title: "Error",
				description: "Username is not available",
				confirmationText: "Choose another username",
				hideCancelButton: true,
			});
		}

		const { data: signUpData, error } = await authClient.signUp.email({
			email: formData.get("email") as string,
			username: formData.get("username") as string,
			name: formData.get("displayname") as string,
			password: formData.get("password") as string,
		});

		if (error) {
			return confirm({
				title: "Error",
				description: error.message,
				hideCancelButton: true,
			});
		}

		await confirm({
			title: "Success",
			description: "Please check your email for verification",
			confirmationText: "Verified, refresh the page",
			hideCancelButton: true,
		});
		window.location.reload();
	}

	return (
		<>
			<Stack>
				<Accordion
					expanded={expand === "3rd-party"}
					onChange={() => setExpand("3rd-party")}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography component="span" variant="h5">
							Sign up with 3rd party
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Stack spacing={2}>
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
					</AccordionDetails>
				</Accordion>
				<Accordion
					expanded={expand === "email"}
					onChange={() => setExpand("email")}
				>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography component="span" variant="h5">
							Sign up with email
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Stack
							component={"form"}
							spacing={2}
							onSubmit={emailSignUp}
						>
							<Typography variant="h5" textAlign="center">
								Email sign up
							</Typography>
							<TextField
								required
								autoComplete="signup-email"
								name="email"
								label="Email"
								type="email"
							/>
							<FormControl required>
								<InputLabel>Username</InputLabel>
								<OutlinedInput
									required
									autoComplete="signup-username"
									name="username"
									label="Username"
									type="text"
								/>
								<FormHelperText>
									In which you use to sign in
								</FormHelperText>
							</FormControl>
							<FormControl required>
								<InputLabel>Display name</InputLabel>
								<OutlinedInput
									required
									autoComplete="signup-displayname"
									name="displayname"
									label="Display name"
									type="text"
								/>
								<FormHelperText>
									In which others sees you
								</FormHelperText>
							</FormControl>
							<TextField
								required
								autoComplete="signup-password"
								name="password"
								label="Password"
								type="password"
							/>
							<TextField
								required
								autoComplete="signup-password-confirm"
								name="password-confirm"
								label="Re-enter your password"
								type="password"
							/>
							<Button
								variant="outlined"
								size="large"
								type="submit"
							>
								Sign up with Email
							</Button>
						</Stack>
					</AccordionDetails>
				</Accordion>
			</Stack>
		</>
	);
}
