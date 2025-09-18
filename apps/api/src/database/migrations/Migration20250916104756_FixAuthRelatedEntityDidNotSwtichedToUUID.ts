import { Migration } from "@mikro-orm/migrations";

export class Migration20250916104756_FixAuthRelatedEntityDidNotSwtichedToUUID extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`alter table "member" drop constraint "member_organization_id_foreign";`,
		);

		this.addSql(
			`alter table "invitation" drop constraint "invitation_organization_id_foreign";`,
		);

		this.addSql(
			`alter table "organization" alter column "id" drop default;`,
		);
		this.addSql(
			`alter table "organization" alter column "id" type uuid using ("id"::text::uuid);`,
		);
		this.addSql(
			`alter table "organization" alter column "id" set default gen_random_uuid();`,
		);

		this.addSql(`alter table "session" alter column "id" drop default;`);
		this.addSql(
			`alter table "session" alter column "id" type uuid using ("id"::text::uuid);`,
		);
		this.addSql(
			`alter table "session" alter column "id" set default gen_random_uuid();`,
		);

		this.addSql(`alter table "member" alter column "id" drop default;`);
		this.addSql(
			`alter table "member" alter column "id" type uuid using ("id"::text::uuid);`,
		);
		this.addSql(
			`alter table "member" alter column "id" set default gen_random_uuid();`,
		);
		this.addSql(
			`alter table "member" alter column "organization_id" drop default;`,
		);
		this.addSql(
			`alter table "member" alter column "organization_id" type uuid using ("organization_id"::text::uuid);`,
		);
		this.addSql(
			`alter table "member" add constraint "member_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`,
		);

		this.addSql(`alter table "invitation" alter column "id" drop default;`);
		this.addSql(
			`alter table "invitation" alter column "id" type uuid using ("id"::text::uuid);`,
		);
		this.addSql(
			`alter table "invitation" alter column "id" set default gen_random_uuid();`,
		);
		this.addSql(
			`alter table "invitation" alter column "organization_id" drop default;`,
		);
		this.addSql(
			`alter table "invitation" alter column "organization_id" type uuid using ("organization_id"::text::uuid);`,
		);
		this.addSql(
			`alter table "invitation" add constraint "invitation_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`,
		);

		this.addSql(`alter table "account" alter column "id" drop default;`);
		this.addSql(
			`alter table "account" alter column "id" type uuid using ("id"::text::uuid);`,
		);
		this.addSql(
			`alter table "account" alter column "id" set default gen_random_uuid();`,
		);

		this.addSql(
			`alter table "verification" alter column "id" drop default;`,
		);
		this.addSql(
			`alter table "verification" alter column "id" type uuid using ("id"::text::uuid);`,
		);
		this.addSql(
			`alter table "verification" alter column "id" set default gen_random_uuid();`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(
			`alter table "organization" alter column "id" type text using ("id"::text);`,
		);

		this.addSql(
			`alter table "session" alter column "id" type text using ("id"::text);`,
		);

		this.addSql(
			`alter table "member" alter column "id" type text using ("id"::text);`,
		);
		this.addSql(
			`alter table "member" alter column "organization_id" type text using ("organization_id"::text);`,
		);

		this.addSql(
			`alter table "member" drop constraint "member_organization_id_foreign";`,
		);

		this.addSql(
			`alter table "invitation" alter column "id" type text using ("id"::text);`,
		);
		this.addSql(
			`alter table "invitation" alter column "organization_id" type text using ("organization_id"::text);`,
		);

		this.addSql(
			`alter table "invitation" drop constraint "invitation_organization_id_foreign";`,
		);

		this.addSql(
			`alter table "account" alter column "id" type text using ("id"::text);`,
		);

		this.addSql(
			`alter table "verification" alter column "id" type text using ("id"::text);`,
		);

		this.addSql(
			`alter table "organization" alter column "id" drop default;`,
		);
		this.addSql(
			`alter table "organization" alter column "id" type text using ("id"::text);`,
		);

		this.addSql(`alter table "session" alter column "id" drop default;`);
		this.addSql(
			`alter table "session" alter column "id" type text using ("id"::text);`,
		);

		this.addSql(`alter table "member" alter column "id" drop default;`);
		this.addSql(
			`alter table "member" alter column "id" type text using ("id"::text);`,
		);
		this.addSql(
			`alter table "member" alter column "organization_id" type text using ("organization_id"::text);`,
		);
		this.addSql(
			`alter table "member" add constraint "member_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`,
		);

		this.addSql(`alter table "invitation" alter column "id" drop default;`);
		this.addSql(
			`alter table "invitation" alter column "id" type text using ("id"::text);`,
		);
		this.addSql(
			`alter table "invitation" alter column "organization_id" type text using ("organization_id"::text);`,
		);
		this.addSql(
			`alter table "invitation" add constraint "invitation_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`,
		);

		this.addSql(`alter table "account" alter column "id" drop default;`);
		this.addSql(
			`alter table "account" alter column "id" type text using ("id"::text);`,
		);

		this.addSql(
			`alter table "verification" alter column "id" drop default;`,
		);
		this.addSql(
			`alter table "verification" alter column "id" type text using ("id"::text);`,
		);
	}
}
