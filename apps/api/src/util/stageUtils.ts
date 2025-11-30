import { UnionStage } from "@/database/entities/stage.entity.js";
import { SportEnum } from "@/sport.js";

export function calculateMinimumRounds(
	paperTarget: { requiredHits: number }[],
	steelTargets: { isNoShoot: boolean }[],
) {
	let rounds = 0;
	paperTarget.forEach((v) => {
		rounds += v.requiredHits;
	});
	steelTargets.forEach((v) => {
		if (!v.isNoShoot) rounds++;
	});
	return rounds;
}

export function calculateUniversalMinimumRounds(stageData: UnionStage) {
	let normalizedPaperTargets: { requiredHits: number }[];
	let normalizedSteelTargets: { isNoShoot: boolean }[];
	switch (stageData.type) {
		case SportEnum.AAIPSC:
			normalizedPaperTargets = stageData.aaipscPaperTargets ?? [];
			normalizedSteelTargets = stageData.aaipscSteelTargets ?? [];
			break;
		case SportEnum.IDPA:
			normalizedPaperTargets = new Array(
				stageData.idpaPaperTargets ?? 0,
			).fill({
				requiredHits: 2,
			});
			normalizedSteelTargets = new Array(
				stageData.idpaSteelTargets ?? 0,
			).fill({
				isNoShoot: false,
			});
			break;
		case SportEnum.IPSC:
			normalizedPaperTargets = stageData.ipscPaperTargets ?? [];
			normalizedSteelTargets = stageData.ipscSteelTargets ?? [];
			break;
		case SportEnum.USPSA:
			normalizedPaperTargets = stageData.uspsaPaperTargets ?? [];
			normalizedSteelTargets = stageData.uspsaSteelTargets ?? [];
			break;
		default:
			normalizedPaperTargets = [];
			normalizedSteelTargets = [];
	}

	return calculateMinimumRounds(
		normalizedPaperTargets,
		normalizedSteelTargets,
	);
}
