import { Entity, type Opt, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
	@PrimaryKey({ type: "text" })
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

	@Property({ type: "text", nullable: true, unique: "user_username_key" })
	username?: string;

	@Property({ fieldName: "displayUsername", type: "text", nullable: true })
	displayUsername?: string;
}
