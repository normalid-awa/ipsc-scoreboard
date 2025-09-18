import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity()
export class Image {
	@PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
	uuid!: string;

	@Property()
	filename!: string;

	@Property()
	mimetype!: string;

	@Property()
	size!: number;

	@Property()
	hash!: string;

	@ManyToOne()
	uploader!: User;
}
