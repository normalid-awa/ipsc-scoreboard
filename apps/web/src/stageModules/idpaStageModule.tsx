import { EditingStageData } from "@/routes/stages/create";
import { IdpaStage } from "@ipsc_scoreboard/api";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement } from "react";
import {
	FrontendStageModule,
	MixableFrontendStageModule,
	StageSpecificData,
} from "./stageModules";

export const MixinIdpaFrontendStageModule: MixableFrontendStageModule<
	IdpaStage
> = (base) => {
	return class MixedIdpaFrontendStageModule
		extends base
		implements FrontendStageModule<IdpaStage>
	{
		getMinimumRounds = super.getMinimumRounds;

		//TODO: Implement IDPA specific stage data input form
		stageDataInputForm(
			setStageData: (
				changes: Partial<StageSpecificData<IdpaStage>>,
			) => void,
		) {
			return <Stack></Stack>;
		}

		//TOOD: Implement IDPA specific stage submission
		async submitStage(data: EditingStageData<IdpaStage>) {
			return;
		}

		stageInfoDisplay(): ReactElement {
			return (
				<Stack sx={{ p: 1 }}>
					<Grid container>
						<Grid size={12}>
							<Typography variant="h6">
								Paper tagets: {this.stage.idpaPaperTargets}
							</Typography>
						</Grid>
						<Grid size={12}>
							<Typography variant="h6">
								Steel targets / Poppers:{" "}
								{this.stage.idpaSteelTargets}
							</Typography>
						</Grid>
					</Grid>
				</Stack>
			);
		}
	};
};
