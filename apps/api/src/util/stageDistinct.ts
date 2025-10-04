import {
	AaipscStage,
	IdpaStage,
	IpscStage,
	Stage,
	UspsaStage,
} from "@/database/entities/stage.entity.js";

export const isIpscStage = (stage?: Stage | null): stage is IpscStage =>
	stage?.type === "IPSC";
export const isIdpaStage = (stage?: Stage | null): stage is IdpaStage =>
	stage?.type === "IDPA";
export const isAaipscStage = (stage?: Stage | null): stage is AaipscStage =>
	stage?.type === "AAIPSC";
export const isUspsaStage = (stage?: Stage | null): stage is UspsaStage =>
	stage?.type === "USPSA";
