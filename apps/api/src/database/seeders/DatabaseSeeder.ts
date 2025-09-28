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

export class DatabaseSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const users = new UserFactory(em)
			.each((user) => {
				const profileAmount = faker.number.int({ min: 1, max: 4 });
				const sports = faker.helpers.arrayElements(
					Object.values(SportEnum),
					profileAmount,
				);
				let i = 0;
				const images = new ImageFactory(em)
					.each((image) => {
						image.uploader = user;
					})
					.make(profileAmount);
				new ShooterProfileFactory(em)
					.each((profile) => {
						profile.sport = sports[i++]!;
						profile.image = images[i - 1];
					})
					.make(profileAmount, {
						user: user,
					});
			})
			.make(10);

		new IpscStageFactory(em)
			.each(async (stage) => {
				const user = faker.helpers.arrayElement(users);
				stage.creator = user;

				if (faker.datatype.boolean()) return;

				new StageImageFactory(em)
					.each((stageImage, i) => {
						stageImage.stage = stage;
						stageImage.order = i;
						stageImage.image = new ImageFactory(em).makeOne({
							uploader: user,
						});
					})
					.make(faker.number.int({ min: 1, max: 5 }));
			})
			.make(20);
	}
}
