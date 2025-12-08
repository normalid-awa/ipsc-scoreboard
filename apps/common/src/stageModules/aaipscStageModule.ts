import { AaipscStage } from "@ipsc_scoreboard/api";
import { StageModule } from "./stageModule.js";

export class AaipscStageModule extends StageModule<AaipscStage> {
	getMinimumRounds(): number {
		let rounds = 0;
		this.stage.aaipscPaperTargets.forEach((v) => {
			rounds += v.requiredHits;
		});
		this.stage.aaipscSteelTargets.forEach((v) => {
			if (!v.isNoShoot) rounds++;
		});
		return rounds;
	}
}
