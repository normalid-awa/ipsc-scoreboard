import {
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
	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	id!: string;

	@ManyToOne({
		entity: () => Organization,
		deleteRule: "cascade",
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
	})
	inviter!: Rel<User>;
}
