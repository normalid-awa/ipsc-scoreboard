import {
	calculateUniversalMinimumRounds,
	Stage,
	UnionStage,
} from "@ipsc_scoreboard/api";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import PlusOneIcon from "@mui/icons-material/PlusOne";
import RemoveIcon from "@mui/icons-material/Remove";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type EditingStageData<T extends Stage = UnionStage> = Partial<T> &
	Partial<{ rawFiles: File[] }>;

interface StepComponenetProps<T extends Stage = UnionStage> {
	stageData: EditingStageData<T>;
	setStageData: (data: EditingStageData<T>) => void;
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
	[K in keyof T as T[K] extends Array<any> ? K : never]: T[K];
};

export const StageDataInput = <T extends Stage, Col>(
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

		const newStage = {
			...props.stageData,
			[props.fieldName]: [
				...((props.stageData[props.fieldName] as any[]) ?? []),
				...newRows,
			],
		};
		newStage.minimumRounds = calculateUniversalMinimumRounds(newStage);
		props.setStageData(newStage);
	};

	const modifyRow =
		<T,>(index: number, col: (typeof props)["column"][number]["name"]) =>
		(v: T) => {
			const newStage = {
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
			newStage.minimumRounds = calculateUniversalMinimumRounds(newStage);
			(newStage[props.fieldName] as Record<string, any>[]).forEach(
				(v, i) => {
					Object.keys(v).forEach((key) => {
						if (
							props.column.find((c) => c.name === key)?.type ===
							"serial"
						) {
							//@ts-expect-error
							newStage[props.fieldName][i][key] = i + 1;
						}
					});
				},
			);
			props.setStageData(newStage);
		};

	const removeRow = (index: number) => () => {
		const newData = [
			...((props.stageData[props.fieldName] as any[]) ?? []),
		];
		newData.splice(index, 1);
		const newStage = {
			...props.stageData,
			[props.fieldName]: newData,
		};
		newStage.minimumRounds = calculateUniversalMinimumRounds(newStage);
		(newStage[props.fieldName] as Record<string, any>[]).forEach((v, i) => {
			Object.keys(v).forEach((key) => {
				if (
					props.column.find((c) => c.name === key)?.type === "serial"
				) {
					//@ts-expect-error
					newStage[props.fieldName][i][key] = i + 1;
				}
			});
		});
		props.setStageData(newStage);
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
