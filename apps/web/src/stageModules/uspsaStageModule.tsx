import { api } from "@/api";
import { StageDataInput } from "@/components/stage/StageDataInput";
import { EditingStageData } from "@/routes/stages/create";
import {
	UspsaPaperTarget,
	UspsaScoringMethod,
	UspsaStage,
	UspsaSteelTarget,
} from "@ipsc_scoreboard/api";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { ReactElement } from "react";
import {
	FrontendStageModule,
	MixableFrontendStageModule,
	StageSpecificData,
} from "./stageModules";

export const MixinUspsaFrontendStageModule: MixableFrontendStageModule<
	UspsaStage
> = (base) => {
	return class MixedUspsaFrontendStageModule
		extends base
		implements FrontendStageModule<UspsaStage>
	{
		getMinimumRounds = super.getMinimumRounds;

		stageDataInputForm(
			setStageData: (
				changes: Partial<StageSpecificData<UspsaStage>>,
			) => void,
		) {
			return (
				<Stack>
					<Typography variant="h5">Steel targets</Typography>
					<StageDataInput<UspsaStage, UspsaSteelTarget>
						stageData={this.stage}
						setStageData={setStageData}
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
						stageData={this.stage}
						setStageData={setStageData}
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
					<FormControl fullWidth sx={{ mt: 2 }}>
						<InputLabel>Scoring method</InputLabel>
						<Select
							value={
								this.stage.uspsaScoringMethod ??
								UspsaScoringMethod.Comstock
							}
							label="Scoring method"
							onChange={(event) => {
								setStageData({
									...this.stage,
									uspsaScoringMethod: event.target
										.value as UspsaScoringMethod,
								});
							}}
						>
							{Object.values(UspsaScoringMethod).map((method) => (
								<MenuItem key={method} value={method}>
									{method}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
			);
		}

		//TODO: JSON.stringify should remove after https://github.com/elysiajs/eden/pull/229 is merged
		async submitStage(data: EditingStageData<UspsaStage>) {
			const res = await api.stage.uspsa.post({
				images: data.rawFiles ?? [],
				uspsaPaperTargets: JSON.stringify(
					data.uspsaPaperTargets ?? [],
				) as unknown as [],
				uspsaSteelTargets: JSON.stringify(
					data.uspsaSteelTargets ?? [],
				) as unknown as [],
				uspsaScoringMethod:
					data.uspsaScoringMethod ?? UspsaScoringMethod.Comstock,
				title: data.title ?? "",
				walkthroughTime: data.walkthroughTime ?? 0,
				description: data.description,
			});
			if (res.error) return false;
			return true;
		}

		stageInfoDisplay(): ReactElement {
			return (
				<Stack spacing={1}>
					<Typography variant="h5">
						Stage type: {this.stage.stageType}
					</Typography>
					<Typography variant="h5">
						Scoring method: {this.stage.uspsaScoringMethod}
					</Typography>
					<Grid container>
						<Grid size={{ xs: 12, sm: "auto", md: 12 }}>
							<Paper
								variant="outlined"
								sx={{ p: 1, overflowX: "auto" }}
							>
								<Typography variant="h6">
									Paper targets (
									{this.stage.uspsaPaperTargets.length})
								</Typography>
								<Table size={"small"}>
									<TableHead>
										<TableRow>
											<TableCell>#</TableCell>
											<TableCell>
												Required shots
											</TableCell>
											<TableCell>Has noshoot</TableCell>
											<TableCell>
												No penalty miss
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{this.stage.uspsaPaperTargets.map(
											(target) => (
												<TableRow key={target.targetId}>
													<TableCell
														scope="row"
														width={20}
													>
														#{target.targetId}
													</TableCell>
													<TableCell>
														{target.requiredHits}
													</TableCell>
													<TableCell>
														{target.hasNoShoot ? (
															<CheckIcon />
														) : (
															<ClearIcon />
														)}
													</TableCell>
													<TableCell>
														{target.isNoPenaltyMiss ? (
															<CheckIcon />
														) : (
															<ClearIcon />
														)}
													</TableCell>
												</TableRow>
											),
										)}
									</TableBody>
								</Table>
							</Paper>
						</Grid>
						<Grid size={{ xs: 12, sm: "grow", md: 12 }}>
							<Paper
								variant="outlined"
								sx={{ p: 1, overflowX: "auto" }}
							>
								<Typography variant="h6">
									Steel targets / Poppers (
									{this.stage.uspsaSteelTargets.length})
								</Typography>
								<Table size={"small"}>
									<TableHead>
										<TableRow>
											<TableCell>#</TableCell>
											<TableCell>Is noshoots</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{this.stage.uspsaSteelTargets.map(
											(target) => (
												<TableRow key={target.targetId}>
													<TableCell
														scope="row"
														width={20}
													>
														#{target.targetId}
													</TableCell>
													<TableCell>
														{target.isNoShoot ? (
															<CheckIcon />
														) : (
															<ClearIcon />
														)}
													</TableCell>
												</TableRow>
											),
										)}
									</TableBody>
								</Table>
							</Paper>
						</Grid>
					</Grid>
				</Stack>
			);
		}
	};
};
