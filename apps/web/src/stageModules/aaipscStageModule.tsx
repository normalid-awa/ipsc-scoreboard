import { api } from "@/api";
import { StageDataInput } from "@/components/stage/StageDataInput";
import { EditingStageData } from "@/routes/stages/create";
import {
	AaipscPaperTarget,
	AaipscStage,
	AaipscSteelTarget,
} from "@ipsc_scoreboard/api";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
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

export const MixinAaipscFrontendStageModule: MixableFrontendStageModule<
	AaipscStage
> = (base) => {
	return class MixedAaipscFrontendStageModule
		extends base
		implements FrontendStageModule<AaipscStage>
	{
		getMinimumRounds = super.getMinimumRounds;

		stageDataInputForm(
			setStageData: (
				changes: Partial<StageSpecificData<AaipscStage>>,
			) => void,
		) {
			return (
				<Stack>
					<Typography variant="h5">Steel targets</Typography>
					<StageDataInput<AaipscStage, AaipscSteelTarget>
						stageData={this.stage}
						setStageData={setStageData}
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
						stageData={this.stage}
						setStageData={setStageData}
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
		}

		//TODO: JSON.stringify should remove after https://github.com/elysiajs/eden/pull/229 is merged
		async submitStage(data: EditingStageData<AaipscStage>) {
			const res = await api.stage.aaipsc.post({
				images: data.rawFiles ?? [],
				aaipscPaperTargets: JSON.stringify(
					data.aaipscPaperTargets ?? [],
				) as unknown as [],
				aaipscSteelTargets: JSON.stringify(
					data.aaipscSteelTargets ?? [],
				) as unknown as [],
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
					<Grid container>
						<Grid size={{ xs: 12, sm: "auto", md: 12 }}>
							<Paper
								variant="outlined"
								sx={{ p: 1, overflowX: "auto" }}
							>
								<Typography variant="h6">
									Paper targets (
									{this.stage.aaipscPaperTargets.length})
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
										{this.stage.aaipscPaperTargets.map(
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
									{this.stage.aaipscSteelTargets.length})
								</Typography>
								<Table size={"small"}>
									<TableHead>
										<TableRow>
											<TableCell>#</TableCell>
											<TableCell>Is noshoots</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{this.stage.aaipscSteelTargets.map(
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
