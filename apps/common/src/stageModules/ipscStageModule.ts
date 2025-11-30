import { calculateMinimumRounds, IpscStage } from "@ipsc_scoreboard/api";
import { StageModule } from "./stageModule.js";

export class IpscStageModule extends StageModule<IpscStage> {
	getMinimumRounds(): number {
		return calculateMinimumRounds(
			this.stage.ipscPaperTargets,
			this.stage.ipscSteelTargets,
		);
	}
}
