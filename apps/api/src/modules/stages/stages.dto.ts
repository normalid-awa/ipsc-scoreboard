import {
	aaipscPaperTargetSchema,
	aaipscSteelTargetSchema,
	ipscPaperTargetSchema,
	ipscSteelTargetSchema,
} from "@/database/entities/stage.entity.js";
import { t } from "elysia";

export const createStageSchema = t.Object({
	title: t.String(),
	description: t.Optional(t.String()),
	walkthroughTime: t.Number(),
	images: t.Optional(t.Array(t.String({ format: "uuid" }))),
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
