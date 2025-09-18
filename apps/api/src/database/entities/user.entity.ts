import {
	Config,
	DefineConfig,
	Entity,
	type Opt,
	PrimaryKey,
	Property,
} from "@mikro-orm/core";

@Entity()
export class User {
	[Config]?: DefineConfig<{ forceObject: false }>;

	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	id!: string;

	@Property({ type: "text" })
	name!: string;

	@Property({ type: "text", unique: "user_email_key" })
	email!: string;

	@Property({ fieldName: "emailVerified" })
	emailVerified!: boolean;

	@Property({ type: "text", nullable: true })
	image?: string;

	@Property({
		fieldName: "createdAt",
		type: "datetime",
		columnType: "timestamp(6)",
		defaultRaw: `CURRENT_TIMESTAMP`,
	})
	createdAt!: Date & Opt;

	@Property({
		fieldName: "updatedAt",
		type: "datetime",
		columnType: "timestamp(6)",
		defaultRaw: `CURRENT_TIMESTAMP`,
	})
	updatedAt!: Date & Opt;
}
