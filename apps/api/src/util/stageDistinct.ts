import {
	AaipscStage,
	IdpaStage,
	IpscStage,
	Stage,
	UnionStage,
	UspsaStage,
} from "@/database/entities/stage.entity.js";

export const isIpscStage = (
	stage?: Stage | UnionStage | null,
): stage is IpscStage => stage?.type === "IPSC";
export const isIdpaStage = (
	stage?: Stage | UnionStage | null,
): stage is IdpaStage => stage?.type === "IDPA";
export const isAaipscStage = (
	stage?: Stage | UnionStage | null,
): stage is AaipscStage => stage?.type === "AAIPSC";
export const isUspsaStage = (
	stage?: Stage | UnionStage | null,
): stage is UspsaStage => stage?.type === "USPSA";
