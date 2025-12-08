import { UspsaStage } from "@ipsc_scoreboard/api";
import { StageModule } from "./stageModule.js";

export class UspsaStageModule extends StageModule<UspsaStage> {
	getMinimumRounds(): number {
		let rounds = 0;
		this.stage.uspsaPaperTargets.forEach((v) => {
			rounds += v.requiredHits;
		});
		this.stage.uspsaSteelTargets.forEach((v) => {
			if (!v.isNoShoot) rounds++;
		});
		return rounds;
	}
}
