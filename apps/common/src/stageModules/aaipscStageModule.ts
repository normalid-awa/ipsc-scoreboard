import { AaipscStage, calculateMinimumRounds } from "@ipsc_scoreboard/api";
import { StageModule } from "./stageModule.js";

export class AaipscStageModule extends StageModule<AaipscStage> {
	getMinimumRounds(): number {
		return calculateMinimumRounds(
			this.stage.aaipscPaperTargets,
			this.stage.aaipscSteelTargets,
		);
	}
}
