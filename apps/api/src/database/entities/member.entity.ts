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
export class Member {
	[Config]?: DefineConfig<{ forceObject: false }>;

	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	id!: string;

	@ManyToOne({
		entity: () => Organization,
		deleteRule: "cascade",
		serializer: (user: User) => user.id,
	})
	organization!: Rel<Organization>;

	@ManyToOne({
		entity: () => User,
		deleteRule: "cascade",
		serializer: (user: User) => user.id,
	})
	user!: Rel<User>;

	@Property({ type: "text" })
	role!: string;

	@Property({ fieldName: "createdAt", columnType: "timestamp(6)" })
	createdAt!: Date;
}
