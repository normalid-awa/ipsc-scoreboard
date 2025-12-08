import {
	Collection,
	Embeddable,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";
import { Image } from "./image.entity.js";
import { ShooterProfile } from "./shooterProfile.entity.js";
import { User } from "./user.entity.js";

export enum ThirdPartyPlatform {
	Instagram = "Instagram",
	Facebook = "Facebook",
	YouTube = "YouTube",
	GoogleMap = "Google Map",
	WhatsApp = "WhatsApp",
	Email = "Email",
	WebSite = "WebSite",
}

@Embeddable()
export class ThirdPartyLink {
	@Enum({
		items: () => ThirdPartyPlatform,
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
	description?: string;

	@Property({ type: "json" })
	thirdPartyLinks: ThirdPartyLink[] = [];

	@OneToOne()
	icon!: Image;

	@OneToOne()
	banner?: Image;

	@OneToMany(() => ShooterProfile, (shooterProfile) => shooterProfile.club)
	members = new Collection<ShooterProfile>(this);

	@OneToOne()
	owner!: User;

	@OneToMany(() => JoinClubRequest, (request) => request.club)
	pendingRequests = new Collection<JoinClubRequest>(this);

	@OneToMany(() => User, (user) => user.clubAdmin)
	admins = new Collection<User>(this);

	@Property()
	createdAt = new Date();
}

@Entity()
export class JoinClubRequest {
	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	uuid!: string;

	@ManyToOne()
	club!: Club;

	@OneToOne()
	from!: ShooterProfile;

	@Property()
	createdAt = new Date();
}
