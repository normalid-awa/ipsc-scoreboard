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
export class Member {
	@PrimaryKey({ type: "text" })
	id!: string;

	@ManyToOne({
		entity: () => Organization,
		deleteRule: "cascade",
	})
	organization!: Rel<Organization>;

	@ManyToOne({
		entity: () => User,
		deleteRule: "cascade",
	})
	user!: Rel<User>;

	@Property({ type: "text" })
	role!: string;

	@Property({ fieldName: "createdAt", columnType: "timestamp(6)" })
	createdAt!: Date;
}
