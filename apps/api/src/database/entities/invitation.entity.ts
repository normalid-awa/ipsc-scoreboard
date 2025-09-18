import {
	Config,
	DefineConfig,
	Entity,
	ManyToOne,
	PrimaryKey,
	Property,
	type Rel,
} from "@mikro-orm/core";
import { Organization } from "./organization.entity.js";
import { User } from "./user.entity.js";

@Entity()
export class Invitation {
	[Config]?: DefineConfig<{ forceObject: false }>;

	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	id!: string;

	@ManyToOne({
		entity: () => Organization,
		deleteRule: "cascade",
		serializer: (user: User) => user.id,
	})
	organization!: Rel<Organization>;

	@Property({ type: "text" })
	email!: string;

	@Property({ type: "text", nullable: true })
	role?: string;

	@Property({ type: "text" })
	status!: string;

	@Property({ fieldName: "expiresAt", columnType: "timestamp(6)" })
	expiresAt!: Date;

	@ManyToOne({
		entity: () => User,
		deleteRule: "cascade",
		serializer: (user: User) => user.id,
	})
	inviter!: Rel<User>;
}
