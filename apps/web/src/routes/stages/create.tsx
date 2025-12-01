import { AuthProtectedComponent } from "@/auth/auth.client";
import NumberSpinner from "@/components/inputs/NumberSpinner";
import { FrontendStageModules } from "@/stageModules/stageModules";
import { SportEnum, Stage, UnionStage } from "@ipsc_scoreboard/api";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useConfirm } from "material-ui-confirm";
import { Dispatch, SetStateAction, useState } from "react";

export const Route = createFileRoute("/stages/create")({
	component: () => <AuthProtectedComponent component={<RouteComponent />} />,
});

export type EditingStageData<T extends Stage = UnionStage> = Partial<T> &
	Partial<{ rawFiles: File[] }>;

interface StepComponenetProps<T extends Stage = UnionStage> {
	stageData: EditingStageData<T>;
	setStageData: Dispatch<SetStateAction<EditingStageData<T>>>;
}

function StageTypeSelector(props: StepComponenetProps) {
	return (
		<FormControl fullWidth required>
			<InputLabel>Stage type</InputLabel>
			<Select
				required
				label="Stage type"
				value={props.stageData.type || 0}
				onChange={(event) => {
					props.setStageData({
						type: event.target.value as SportEnum,
					});
				}}
			>
				<MenuItem disabled value={0}>
					<em>Select a stage type</em>
				</MenuItem>
				{Object.entries(SportEnum).map(([v, e]) => (
					<MenuItem key={v} value={e}>
						{v}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

function CommonDataInput(props: StepComponenetProps) {
	return (
		<>
			<Stack spacing={2}>
				<TextField
					required
					fullWidth
					label="Title"
					value={props.stageData.title || ""}
					onChange={(event) =>
						props.setStageData({
							...props.stageData,
							title: event.currentTarget.value,
						})
					}
				/>
				<TextField
					fullWidth
					multiline
					label="Description"
					value={props.stageData.description || ""}
					minRows={5}
					onChange={(event) =>
						props.setStageData({
							...props.stageData,
							description: event.currentTarget.value,
						})
					}
				/>
				<NumberSpinner
					label={`Walkthrough / Preparation time (${props.stageData.walkthroughTime ?? 0} seconds / ${(
						(props.stageData.walkthroughTime ?? 0) / 60
					).toPrecision(2)} minutes)`}
					min={1}
					step={1}
					value={props.stageData.walkthroughTime ?? 0}
					onValueChange={(value) =>
						props.setStageData({
							...props.stageData,
							walkthroughTime: value ?? 0,
						})
					}
				/>
			</Stack>
		</>
	);
}

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

function UploadStageAttachments(props: StepComponenetProps) {
	const confirm = useConfirm();
	return (
		<>
			{props.stageData.rawFiles?.length == 0 && <p>No files uploaded</p>}
			<Stack
				direction={"row"}
				spacing={2}
				sx={{
					overflow: "auto",
				}}
			>
				{props.stageData.rawFiles?.map((file, index) => (
					<Box key={file.name}>
						<Box
							sx={{
								position: "relative",
							}}
						>
							<Box
								sx={{
									maxHeight: 200,
									pointerEvents: "none",
									position: "relative",
									borderRadius: (t) =>
										t.vars?.shape.borderRadius,
								}}
								component={"img"}
								src={URL.createObjectURL(file)}
							/>
							<IconButton
								sx={{
									background: (t) => t.palette.action.active,
									backdropFilter: "invert(50%)",
									position: "absolute",
									top: 2,
									right: 2,
								}}
								onClick={() => {
									const newFiles = [
										...props.stageData.rawFiles!,
									];
									newFiles.splice(index, 1);
									props.setStageData({
										...props.stageData,
										rawFiles: newFiles,
									});
								}}
							>
								<RemoveIcon />
							</IconButton>
						</Box>
						<ButtonGroup fullWidth>
							<Button
								disabled={index === 0}
								onClick={() => {
									const newFiles = [
										...(props.stageData.rawFiles || []),
									];
									const file = newFiles[index];
									newFiles.splice(index, 1);
									newFiles.splice(index - 1, 0, file);
									props.setStageData({
										...props.stageData,
										rawFiles: newFiles,
									});
								}}
							>
								<ArrowLeftIcon />
							</Button>
							<Button
								disabled={
									index ===
									props.stageData.rawFiles!.length - 1
								}
								onClick={() => {
									const newFiles = [
										...(props.stageData.rawFiles || []),
									];
									const file = newFiles[index];
									newFiles.splice(index, 1);
									newFiles.splice(index + 1, 0, file);
									props.setStageData({
										...props.stageData,
										rawFiles: newFiles,
									});
								}}
							>
								<ArrowRightIcon />
							</Button>
						</ButtonGroup>
					</Box>
				))}
			</Stack>
			<Button
				component="label"
				role={undefined}
				variant="contained"
				tabIndex={-1}
				startIcon={<CloudUploadIcon />}
				sx={{ mt: 2 }}
			>
				Upload files
				<VisuallyHiddenInput
					type="file"
					accept="image/*"
					onChange={(event) => {
						const arrayOfFiles = Array.from(
							event.target.files || [],
						);
						for (const file of arrayOfFiles) {
							if (!file.type.startsWith("image/")) {
								confirm({
									hideCancelButton: true,
									description: "Only image is allowed",
									title: "Invalid file type",
								});
								return;
							}
						}
						props.setStageData({
							...props.stageData,
							rawFiles: [
								...(props.stageData.rawFiles || []),
								...Array.from(event.target.files || []),
							],
						});
					}}
					multiple
				/>
			</Button>
		</>
	);
}

function StageSpecificDataInput(props: StepComponenetProps) {
	if (props.stageData.type)
		return FrontendStageModules[props.stageData.type](
			//@ts-expect-error
			props.stageData,
		).stageDataInputForm(props.setStageData);
}

const steps = [
	{
		label: "Set stage type",
		nextStepChecker: (stageData: EditingStageData) =>
			stageData.type !== undefined,
		content: StageTypeSelector,
	},
	{
		label: "Set common stage information",
		nextStepChecker: (stageData: EditingStageData) => !!stageData.title,
		content: CommonDataInput,
	},
	{
		label: "Upload stage attachments",
		nextStepChecker: () => true,
		content: UploadStageAttachments,
	},
	{
		label: "Set stage targets and additional informations",
		nextStepChecker: (stageData: EditingStageData) =>
			stageData?.minimumRounds ?? 0 > 0,
		content: StageSpecificDataInput,
	},
] as const;

function RouteComponent() {
	const [activeStep, setActiveStep] = useState(0);
	const [stageData, setStageData] = useState<EditingStageData>({});
	const queryClient = useQueryClient();
	const to = Route.useNavigate();
	const dialog = useConfirm();

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
		setStageData({});
	};

	const submitStage = async () => {
		if (!stageData.type) return;
		const result = await FrontendStageModules[stageData.type](
			// @ts-expect-error
			stageData,
		).submitStage(stageData);
		if (result) {
			queryClient.invalidateQueries({ queryKey: ["stages"] });
			to({
				to: "/stages/$stageId",
				params: {
					stageId: result.toString(),
				},
			});
		} else {
			dialog({
				hideCancelButton: true,
				title: "Fail to create stage",
			});
		}
	};

	return (
		<>
			<Container maxWidth="md">
				<Stepper activeStep={activeStep} orientation="vertical">
					{steps.map((step, index, arr) => (
						<Step key={index}>
							<StepLabel
								onClick={() => {
									if (step.nextStepChecker(stageData))
										setActiveStep(index);
								}}
							>
								{step.label}
							</StepLabel>
							<StepContent>
								<Paper variant="outlined" sx={{ p: 2 }}>
									{step.content.call(null, {
										stageData: stageData,
										setStageData,
									})}
									<Stack
										direction={"row"}
										sx={{ mt: 2 }}
										spacing={2}
									>
										{index === arr.length - 1 ? (
											<Button
												variant="contained"
												color="success"
												disabled={
													!step.nextStepChecker(
														stageData,
													)
												}
												onClick={submitStage}
											>
												Finish
											</Button>
										) : (
											<Button
												variant="contained"
												onClick={handleNext}
												disabled={
													!step.nextStepChecker(
														stageData,
													)
												}
											>
												Continue
											</Button>
										)}
										<Button
											disabled={index === 0}
											onClick={handleBack}
										>
											Back
										</Button>
										<Button
											onClick={handleReset}
											color="warning"
										>
											Reset
										</Button>
									</Stack>
								</Paper>
							</StepContent>
						</Step>
					))}
				</Stepper>
			</Container>
		</>
	);
}
