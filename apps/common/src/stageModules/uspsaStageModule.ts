import { calculateMinimumRounds, UspsaStage } from "@ipsc_scoreboard/api";
import { StageModule } from "./stageModule.js";

export class UspsaStageModule extends StageModule<UspsaStage> {
	getMinimumRounds(): number {
		return calculateMinimumRounds(
			this.stage.uspsaPaperTargets,
			this.stage.uspsaSteelTargets,
		);
	}
}
