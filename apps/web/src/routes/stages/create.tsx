import {
	AaipscPaperTarget,
	AaipscStage,
	AaipscSteelTarget,
	calculateUniversalMinimumRounds,
	IpscPaperTarget,
	IpscStage,
	IpscSteelTarget,
	SportEnum,
	Stage,
	UnionStage,
	UspsaPaperTarget,
	UspsaStage,
	UspsaSteelTarget,
} from "@ipsc_scoreboard/api";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import RemoveIcon from "@mui/icons-material/Remove";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createFileRoute } from "@tanstack/react-router";
import { useConfirm } from "material-ui-confirm";
import { Dispatch, SetStateAction, useState } from "react";

export const Route = createFileRoute("/stages/create")({
	component: RouteComponent,
});

type EditingStageData<T extends Stage = UnionStage> = Partial<T> &
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

interface StageDataRowEditorProps<T> {
	value: T;
	setValue: (v: T) => void;
}

const StageDataRowEditorBooleanCheckBox = (
	props: StageDataRowEditorProps<boolean>,
) => {
	return (
		<Checkbox
			size="small"
			value={props.value}
			onChange={(event) => props.setValue(event.target.checked)}
		/>
	);
};

const StageDataRowEditorNumericInput = (
	props: StageDataRowEditorProps<number>,
) => {
	return (
		<Input
			size="small"
			slotProps={{
				input: {
					type: "number",
					min: 0,
					step: 1,
				},
			}}
			value={props.value}
			onChange={(event) => props.setValue(parseInt(event.target.value))}
		/>
	);
};

type ArrayKey<T> = {
	[K in keyof T as T[K] extends Array<infer U> ? K : never]: T[K];
};

const StageDataInput = <T extends Stage, Col>(
	props: StepComponenetProps<T> & {
		column: {
			name: keyof Col;
			label: string;
			type: "number" | "string" | "boolean" | "serial";
			defaultValue?: number | string | boolean;
			followPrevious?: boolean;
		}[];
		fieldName: keyof ArrayKey<T>;
	},
) => {
	const addRow = (count: number = 1) => {
		const newRows: Record<keyof Col, any>[] = [] as Record<
			keyof Col,
			any
		>[];

		for (let i = 0; i < count; i++) {
			const newRow: Record<keyof Col, any> = {} as Record<keyof Col, any>;
			let prevRow: typeof newRow | undefined;
			if (
				((props.stageData[props.fieldName] as any[]) ?? []).length > 0
			) {
				prevRow = ((props.stageData[props.fieldName] as any[]) ?? [])[
					((props.stageData[props.fieldName] as any[]) ?? []).length -
						1
				];
			}
			props.column?.forEach((col) => {
				if (col.type === "serial") {
					let maxIndex = 0;
					[
						...((props.stageData[props.fieldName] as any[]) ?? []),
						...newRows,
					].forEach((v) => {
						if (v[col.name] > maxIndex) {
							maxIndex = v[col.name];
						}
					});
					newRow[col.name] = maxIndex + 1;
				} else if (col.type === "number") {
					if (col.followPrevious && prevRow) {
						newRow[col.name] = prevRow[col.name];
					} else {
						newRow[col.name] = col.defaultValue ?? 0;
					}
				} else if (col.type === "string") {
					if (col.followPrevious && prevRow) {
						newRow[col.name] = prevRow[col.name];
					} else {
						newRow[col.name] = col.defaultValue ?? "";
					}
				} else if (col.type === "boolean") {
					if (col.followPrevious && prevRow) {
						newRow[col.name] = prevRow[col.name];
					} else {
						newRow[col.name] = col.defaultValue ?? false;
					}
				}
			});
			newRows.push(newRow);
		}

		props.setStageData((prev) => {
			const stage = {
				...prev,
				[props.fieldName]: [
					...((props.stageData[props.fieldName] as any[]) ?? []),
					...newRows,
				],
			};
			stage.minimumRounds = calculateUniversalMinimumRounds(stage);
			return stage;
		});
	};

	const modifyRow =
		<T,>(index: number, col: (typeof props)["column"][number]["name"]) =>
		(v: T) => {
			props.setStageData(() => {
				const stage = {
					...props.stageData,
					[props.fieldName]: [
						...((props.stageData[props.fieldName] as any[]) ?? []),
					].map((row, i) =>
						i === index
							? {
									...row,
									[col]: v,
								}
							: row,
					),
				};
				stage.minimumRounds = calculateUniversalMinimumRounds(stage);
				(stage[props.fieldName] as Record<string, any>[]).forEach(
					(v, i) => {
						Object.keys(v).forEach((key) => {
							if (
								props.column.find((c) => c.name === key)
									?.type === "serial"
							) {
								//@ts-expect-error
								stage[props.fieldName][i][key] = i + 1;
							}
						});
					},
				);
				return stage;
			});
		};

	const removeRow = (index: number) => () => {
		const newData = [
			...((props.stageData[props.fieldName] as any[]) ?? []),
		];
		newData.splice(index, 1);
		props.setStageData(() => {
			const stage = {
				...props.stageData,
				[props.fieldName]: newData,
			};
			stage.minimumRounds = calculateUniversalMinimumRounds(stage);
			(stage[props.fieldName] as Record<string, any>[]).forEach(
				(v, i) => {
					Object.keys(v).forEach((key) => {
						if (
							props.column.find((c) => c.name === key)?.type ===
							"serial"
						) {
							//@ts-expect-error
							stage[props.fieldName][i][key] = i + 1;
						}
					});
				},
			);
			return stage;
		});
	};

	return (
		<>
			<TableContainer component={Paper}>
				<Table size="small">
					<TableHead>
						{props.column?.map((col, index) => (
							<TableCell key={index}>{col.label}</TableCell>
						))}
						<TableCell>Actions</TableCell>
					</TableHead>
					<TableBody>
						{(
							(props.stageData?.[props.fieldName] as any[]) ?? []
						).map((v, i) => (
							<TableRow key={i}>
								{props.column?.map((col, index) => {
									switch (col.type) {
										case "boolean":
											return (
												<TableCell key={index}>
													<StageDataRowEditorBooleanCheckBox
														value={v[col.name]}
														setValue={modifyRow(
															i,
															col.name,
														)}
													/>
												</TableCell>
											);
										case "number":
											return (
												<TableCell key={index}>
													<StageDataRowEditorNumericInput
														value={v[col.name]}
														setValue={modifyRow(
															i,
															col.name,
														)}
													/>
												</TableCell>
											);
									}
									return (
										<TableCell key={index}>
											{v[col.name]}
										</TableCell>
									);
								})}
								<TableCell>
									<IconButton onClick={removeRow(i)}>
										<RemoveIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
						<TableRow>
							<TableCell colSpan={props.column?.length / 2}>
								<Button
									variant="outlined"
									fullWidth
									onClick={() => addRow(1)}
									size="small"
								>
									<PlusOneIcon />
								</Button>
							</TableCell>
							<TableCell colSpan={props.column?.length / 2 + 1}>
								<Button
									variant="outlined"
									fullWidth
									onClick={() => {
										const count = parseInt(
											prompt("Number of rows to add")!,
										);
										addRow(count);
									}}
									size="small"
								>
									<FormatListBulletedAddIcon />
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

function StageSpecificDataInput(props: StepComponenetProps) {
	switch (props.stageData.type) {
		case SportEnum.IPSC:
			return (
				<Stack>
					<Typography variant="h5">Steel targets</Typography>
					<StageDataInput<IpscStage, IpscSteelTarget>
						{...props}
						fieldName="ipscSteelTargets"
						column={[
							{
								name: "targetId",
								label: "Target #",
								type: "serial",
							},
							{
								name: "isNoShoot",
								label: "No Shoot",
								type: "boolean",
								defaultValue: false,
							},
						]}
					/>
					<Divider sx={{ my: 1 }} />
					<Typography variant="h5">Paper targets</Typography>
					<StageDataInput<IpscStage, IpscPaperTarget>
						{...props}
						fieldName="ipscPaperTargets"
						column={[
							{
								name: "targetId",
								label: "Target #",
								type: "serial",
							},
							{
								name: "requiredHits",
								label: "Required Hits",
								type: "number",
								defaultValue: 2,
								followPrevious: true,
							},
							{
								name: "hasNoShoot",
								label: "No Shoot",
								type: "boolean",
								defaultValue: false,
							},
							{
								name: "isNoPenaltyMiss",
								label: "Enable no-penalty-miss",
								type: "boolean",
								defaultValue: false,
							},
						]}
					/>
				</Stack>
			);
		case SportEnum.USPSA:
			return (
				<Stack>
					<Typography variant="h5">Steel targets</Typography>
					<StageDataInput<UspsaStage, UspsaSteelTarget>
						{...props}
						fieldName="uspsaSteelTargets"
						column={[
							{
								name: "targetId",
								label: "Target #",
								type: "serial",
							},
							{
								name: "isNoShoot",
								label: "No Shoot",
								type: "boolean",
								defaultValue: false,
							},
						]}
					/>
					<Divider sx={{ my: 1 }} />
					<Typography variant="h5">Paper targets</Typography>
					<StageDataInput<UspsaStage, UspsaPaperTarget>
						{...props}
						fieldName="uspsaPaperTargets"
						column={[
							{
								name: "targetId",
								label: "Target #",
								type: "serial",
							},
							{
								name: "requiredHits",
								label: "Required Hits",
								type: "number",
								defaultValue: 2,
								followPrevious: true,
							},
							{
								name: "hasNoShoot",
								label: "No Shoot",
								type: "boolean",
								defaultValue: false,
							},
							{
								name: "isNoPenaltyMiss",
								label: "Enable no-penalty-miss",
								type: "boolean",
								defaultValue: false,
							},
						]}
					/>
				</Stack>
			);
		case SportEnum.AAIPSC:
			return (
				<Stack>
					<Typography variant="h5">Steel targets</Typography>
					<StageDataInput<AaipscStage, AaipscSteelTarget>
						{...props}
						fieldName="aaipscSteelTargets"
						column={[
							{
								name: "targetId",
								label: "Target #",
								type: "serial",
							},
							{
								name: "isNoShoot",
								label: "No Shoot",
								type: "boolean",
								defaultValue: false,
							},
						]}
					/>
					<Divider sx={{ my: 1 }} />
					<Typography variant="h5">Paper targets</Typography>
					<StageDataInput<AaipscStage, AaipscPaperTarget>
						{...props}
						fieldName="aaipscPaperTargets"
						column={[
							{
								name: "targetId",
								label: "Target #",
								type: "serial",
							},
							{
								name: "requiredHits",
								label: "Required Hits",
								type: "number",
								defaultValue: 2,
								followPrevious: true,
							},
							{
								name: "hasNoShoot",
								label: "No Shoot",
								type: "boolean",
								defaultValue: false,
							},
							{
								name: "isNoPenaltyMiss",
								label: "Enable no-penalty-miss",
								type: "boolean",
								defaultValue: false,
							},
						]}
					/>
				</Stack>
			);
		//TODO: IDPA stage data input
		case SportEnum.IDPA:
		default:
			return null;
	}
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

	const submitStage = () => {
		console.log(stageData);
	};

	const [stageData, setStageData] = useState<EditingStageData>({});

	return (
		<>
			<Container maxWidth="md">
				<Stepper activeStep={activeStep} orientation="vertical">
					{steps.map((step, index, arr) => (
						<Step key={index}>
							<StepLabel>{step.label}</StepLabel>
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
