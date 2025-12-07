import {
	aaipscPaperTargetSchema,
	aaipscSteelTargetSchema,
	ipscPaperTargetSchema,
	ipscSteelTargetSchema,
	uspsaPaperTargetSchema,
	uspsaSteelTargetSchema,
} from "@/database/entities/stage.entity.js";
import { UspsaScoringMethod } from "@/database/entities/stage.externalDep.js";
import { t } from "elysia";

export const stagePopulateSchema = t.Array(
	t.UnionEnum(["creator.image", "creator.name"] as const),
);

export const createStageSchema = t.Object({
	title: t.String(),
	description: t.Optional(t.String()),
	walkthroughTime: t.Numeric(),
	images: t.Union([
		t.MaybeEmpty(t.Files({ type: "image/*" })),
		t.Literal(""),
	]),
});

export const createIpscStageSchema = t.Composite([
	createStageSchema,
	t.Object({
		ipscPaperTargets: t.ArrayString(ipscPaperTargetSchema),
		ipscSteelTargets: t.ArrayString(ipscSteelTargetSchema),
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
		aaipscPaperTargets: t.ArrayString(aaipscPaperTargetSchema),
		aaipscSteelTargets: t.ArrayString(aaipscSteelTargetSchema),
	}),
]);

export const createUspsaStageSchema = t.Composite([
	createStageSchema,
	t.Object({
		uspsaPaperTargets: t.ArrayString(uspsaPaperTargetSchema),
		uspsaSteelTargets: t.ArrayString(uspsaSteelTargetSchema),
		uspsaScoringMethod: t.Enum(UspsaScoringMethod),
	}),
]);
