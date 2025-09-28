import {
	aaipscPaperTargetSchema,
	aaipscSteelTargetSchema,
	ipscPaperTargetSchema,
	ipscSteelTargetSchema,
	uspsaPaperTargetSchema,
	UspsaScoringMethod,
	uspsaSteelTargetSchema,
} from "@/database/entities/stage.entity.js";
import { t } from "elysia";

export const createStageSchema = t.Object({
	title: t.String(),
	description: t.Optional(t.String()),
	walkthroughTime: t.Number(),
	images: t.Optional(t.Files({ type: "image/*" })),
});

export const createIpscStageSchema = t.Composite([
	createStageSchema,
	t.Object({
		ipscPaperTargets: t.Array(ipscPaperTargetSchema),
		ipscSteelTargets: t.Array(ipscSteelTargetSchema),
	}),
]);

export const createIdpaStageSchema = t.Composite([
	createStageSchema,
	t.Object({
		idpaPaperTargets: t.Integer(),
		idpaSteelTargets: t.Integer(),
	}),
]);

export const createAaipscStageSchema = t.Composite([
	createStageSchema,
	t.Object({
		aaipscPaperTargets: t.Array(aaipscPaperTargetSchema),
		aaipscSteelTargets: t.Array(aaipscSteelTargetSchema),
	}),
]);

export const createUspsaStageSchema = t.Composite([
	createStageSchema,
	t.Object({
		uspsaPaperTargets: t.Array(uspsaPaperTargetSchema),
		uspsaSteelTargets: t.Array(uspsaSteelTargetSchema),
		uspsaScoringMethod: t.Enum(UspsaScoringMethod),
	}),
]);
