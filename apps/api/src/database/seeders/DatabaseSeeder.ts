import { type EntityManager } from "@mikro-orm/core";
import { Factory, Seeder } from "@mikro-orm/seeder";
import { User } from "../entities/user.entity.js";
import { faker } from "@faker-js/faker";
import { ShooterProfile } from "../entities/shooterProfile.entity.js";
import { SportEnum } from "../../sport.js";
import { Image } from "../entities/image.entity.js";
import { IpscStage, Stage, StageImage } from "../entities/stage.entity.js";

export class UserFactory extends Factory<User> {
	model = User;

	definition(): Partial<User> {
		return {
			email: faker.internet.email(),
			emailVerified: true,
			image: faker.image.avatarGitHub(),
			name: faker.person.fullName(),
		};
	}
}

export class ShooterProfileFactory extends Factory<ShooterProfile> {
	model = ShooterProfile;

	definition(): Partial<ShooterProfile> {
		return {
			identifier: `${faker.person.fullName()} - ${faker.string.nanoid(4)}`,
		};
	}
}

export class ImageFactory extends Factory<Image> {
	model = Image;

	definition(): Partial<Image> {
		return {
			filename: faker.system.commonFileName("png"),
			hash: faker.git.commitSha(),
			mimetype: "image/png",
			size: faker.number.int({ min: 1000, max: 1000000 }),
		};
	}
}

export class StageImageFactory extends Factory<StageImage> {
	model = StageImage;

	definition(): Partial<StageImage> {
		return {};
	}
}

function stageDefinition(em: EntityManager, sport?: SportEnum): Partial<Stage> {
	return {
		description: faker.helpers.maybe(faker.lorem.paragraphs),
		title: faker.music.songName(),
		type: sport,
		walkthroughTime: faker.number.int({ min: 1, max: 320 }),
	};
}

export class IpscStageFactory extends Factory<IpscStage> {
	model = IpscStage;

	definition(): Partial<IpscStage> {
		return {
			...stageDefinition(this.em, SportEnum.IPSC),
			ipscPaperTargets: new Array(faker.number.int({ min: 1, max: 20 }))
				.fill(0)
				.map((v, i) => ({
					hasNoShoot: faker.datatype.boolean(),
					isNoPenaltyMiss: faker.datatype.boolean(),
					requiredHits: faker.number.int({ min: 2, max: 3 }),
					targetId: i,
				})),
			ipscSteelTargets: new Array(faker.number.int({ min: 1, max: 20 }))
				.fill(0)
				.map((v, i) => ({
					isNoShoot: faker.datatype.boolean(),
					targetId: i,
				})),
		};
	}
}

export async function getPersistedMockImage(
	em: EntityManager,
	uploader: User,
	width: number,
	height: number,
) {
	const image = new Image();
	await image.upload(
		new File(
			[
				await fetch(
					faker.image.urlPicsumPhotos({
						width,
						height,
						blur: 0,
					}),
				).then((r) => r.blob()),
			],
			faker.system.commonFileName("png"),
		),
		uploader!,
	);
	em.persist(image);
	return image;
}

export class DatabaseSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const users = new UserFactory(em).make(10);

		const shooterProfile = users.map((user) => {
			const profileAmount = faker.number.int({ min: 1, max: 4 });
			const sports = faker.helpers.arrayElements(
				Object.values(SportEnum),
				profileAmount,
			);
			let i = 0;
			return new ShooterProfileFactory(em)
				.each((shooterProfile) => {
					shooterProfile.sport = sports[i++]!;
					shooterProfile.user = user;
				})
				.make(profileAmount);
		});

		for await (const profiles of shooterProfile) {
			for await (const profile of profiles) {
				profile.image = await getPersistedMockImage(
					em,
					profile.user!,
					300,
					300,
				);
			}
		}

		const ipscStages = new IpscStageFactory(em)
			.each(async (stage) => {
				const user = faker.helpers.arrayElement(users);
				stage.creator = user;
			})
			.make(15);

		for await (const ipscStage of ipscStages) {
			if (faker.datatype.boolean()) return;
			const stageImages: StageImage[] = [];
			for (let i = 0; i < faker.number.int({ min: 1, max: 5 }); i++) {
				stageImages.push(
					new StageImage(
						ipscStage,
						await getPersistedMockImage(
							em,
							ipscStage.creator!,
							300,
							300,
						),
						i,
					),
				);
			}
			em.persist(stageImages);
		}
	}
}
