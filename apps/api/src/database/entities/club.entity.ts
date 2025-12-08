import {
	Collection,
	Embeddable,
	Entity,
	Enum,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { Image } from "./image.entity.js";
import { ShooterProfile } from "./shooterProfile.entity.js";

export const enum ThirdPartyPlatform {}

@Embeddable()
export class ThirdPartyLink {
	@Enum({
		items: () => ThirdPartyLink,
		nativeEnumName: "thirdparty_platform",
	})
	platform!: ThirdPartyPlatform;

	@Property()
	link!: string;
}

@Entity()
export class Club {
	@PrimaryKey()
	id!: number;

	@Property()
	name!: string;

	@Property({ type: "text" })
	description!: string;

	@Property({ type: "json" })
	thirdPartyLinks: ThirdPartyLink[] = [];

	@OneToOne()
	icon!: Image;

	@OneToOne()
	banner!: Image;

	@OneToMany(() => ShooterProfile, (shooterProfile) => shooterProfile.club)
	members = new Collection<ShooterProfile>(this);

	@Property()
	createdAt = new Date();
}
