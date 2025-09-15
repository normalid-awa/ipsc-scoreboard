import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

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
}
