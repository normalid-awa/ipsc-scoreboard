import orm from "@/database/orm.js";
import { DatabaseSeeder } from "@/database/seeders/DatabaseSeeder.js";
import { afterAll, beforeAll, expect, test } from "vitest";
import { treaty } from "@elysiajs/eden";
import { app } from "@/server.js";
import { IpscStage } from "@/database/entities/stage.entity.js";

beforeAll(async () => {
	// Refresh the database to start clean
	await orm.schema.refreshDatabase();

	// And run the seeder afterwards
	await orm.seeder.seed(DatabaseSeeder);
});

const { api } = treaty(app);

test("Test ipsc stage creation", async () => {
	const testStageData = {
		title: "Test ipsc stage 1",
		walkthroughTime: 120,
		description: "Nice stage \n nextline",
		ipscPaperTargets: [
			{
				targetId: 0,
				hasNoShoot: false,
				requiredHits: 3,
				isNoPenaltyMiss: true,
			},
			{
				targetId: 1,
				hasNoShoot: false,
				requiredHits: 2,
				isNoPenaltyMiss: true,
			},
			{
				targetId: 2,
				hasNoShoot: false,
				requiredHits: 3,
				isNoPenaltyMiss: false,
			},
			{
				targetId: 3,
				hasNoShoot: true,
				requiredHits: 2,
				isNoPenaltyMiss: true,
			},
			{
				targetId: 4,
				hasNoShoot: true,
				requiredHits: 2,
				isNoPenaltyMiss: true,
			},
			{
				targetId: 5,
				hasNoShoot: true,
				requiredHits: 2,
				isNoPenaltyMiss: false,
			},
			{
				targetId: 6,
				hasNoShoot: false,
				requiredHits: 2,
				isNoPenaltyMiss: false,
			},
			{
				targetId: 7,
				hasNoShoot: false,
				requiredHits: 2,
				isNoPenaltyMiss: true,
			},
			{
				targetId: 8,
				hasNoShoot: true,
				requiredHits: 2,
				isNoPenaltyMiss: true,
			},
			{
				targetId: 9,
				hasNoShoot: false,
				requiredHits: 2,
				isNoPenaltyMiss: true,
			},
			{
				targetId: 10,
				hasNoShoot: false,
				requiredHits: 3,
				isNoPenaltyMiss: true,
			},
			{
				targetId: 11,
				hasNoShoot: false,
				requiredHits: 2,
				isNoPenaltyMiss: false,
			},
			{
				targetId: 12,
				hasNoShoot: false,
				requiredHits: 2,
				isNoPenaltyMiss: true,
			},
			{
				targetId: 13,
				hasNoShoot: false,
				requiredHits: 3,
				isNoPenaltyMiss: true,
			},
			{
				targetId: 14,
				hasNoShoot: false,
				requiredHits: 2,
				isNoPenaltyMiss: false,
			},
			{
				targetId: 15,
				hasNoShoot: false,
				requiredHits: 2,
				isNoPenaltyMiss: false,
			},
			{
				targetId: 16,
				hasNoShoot: true,
				requiredHits: 3,
				isNoPenaltyMiss: false,
			},
			{
				targetId: 17,
				hasNoShoot: true,
				requiredHits: 2,
				isNoPenaltyMiss: false,
			},
		],
		ipscSteelTargets: [
			{
				targetId: 0,
				isNoShoot: true,
			},
			{
				targetId: 1,
				isNoShoot: false,
			},
			{
				targetId: 2,
				isNoShoot: false,
			},
		],
		images: [],
	} satisfies Parameters<typeof api.stage.ipsc.post>[0];

	let createResult = await api.stage.ipsc.post(testStageData);
	expect(createResult.status).toBe(200);
	expect(
		await orm.em.fork().findOne(IpscStage, createResult.data!.id),
	).toBeInstanceOf(IpscStage);
});

afterAll(async () => {
	await orm.close();
});
