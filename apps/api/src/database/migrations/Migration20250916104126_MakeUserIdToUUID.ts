import { Migration } from "@mikro-orm/migrations";

export class Migration20250916104126_MakeUserIdToUUID extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`alter table "session" drop constraint "session_user_id_foreign";`,
		);

		this.addSql(
			`alter table "member" drop constraint "member_user_id_foreign";`,
		);

		this.addSql(
			`alter table "invitation" drop constraint "invitation_inviter_id_foreign";`,
		);

		this.addSql(
			`alter table "image" drop constraint "image_uploader_id_foreign";`,
		);

		this.addSql(
			`alter table "shooter_profile" drop constraint "shooter_profile_user_id_foreign";`,
		);

		this.addSql(
			`alter table "account" drop constraint "account_user_id_foreign";`,
		);

		this.addSql(`alter table "user" alter column "id" drop default;`);
		this.addSql(
			`alter table "user" alter column "id" type uuid using ("id"::text::uuid);`,
		);
		this.addSql(
			`alter table "user" alter column "id" set default gen_random_uuid();`,
		);

		this.addSql(
			`alter table "session" alter column "user_id" drop default;`,
		);
		this.addSql(
			`alter table "session" alter column "user_id" type uuid using ("user_id"::text::uuid);`,
		);
		this.addSql(
			`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`,
		);

		this.addSql(
			`alter table "member" alter column "user_id" drop default;`,
		);
		this.addSql(
			`alter table "member" alter column "user_id" type uuid using ("user_id"::text::uuid);`,
		);
		this.addSql(
			`alter table "member" add constraint "member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`,
		);

		this.addSql(
			`alter table "invitation" alter column "inviter_id" drop default;`,
		);
		this.addSql(
			`alter table "invitation" alter column "inviter_id" type uuid using ("inviter_id"::text::uuid);`,
		);
		this.addSql(
			`alter table "invitation" add constraint "invitation_inviter_id_foreign" foreign key ("inviter_id") references "user" ("id") on update cascade on delete cascade;`,
		);

		this.addSql(
			`alter table "image" alter column "uploader_id" drop default;`,
		);
		this.addSql(
			`alter table "image" alter column "uploader_id" type uuid using ("uploader_id"::text::uuid);`,
		);
		this.addSql(
			`alter table "image" add constraint "image_uploader_id_foreign" foreign key ("uploader_id") references "user" ("id") on update cascade;`,
		);

		this.addSql(
			`alter table "shooter_profile" alter column "user_id" drop default;`,
		);
		this.addSql(
			`alter table "shooter_profile" alter column "user_id" type uuid using ("user_id"::text::uuid);`,
		);
		this.addSql(
			`alter table "shooter_profile" add constraint "shooter_profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`,
		);

		this.addSql(
			`alter table "account" alter column "user_id" drop default;`,
		);
		this.addSql(
			`alter table "account" alter column "user_id" type uuid using ("user_id"::text::uuid);`,
		);
		this.addSql(
			`alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(
			`alter table "user" alter column "id" type text using ("id"::text);`,
		);

		this.addSql(
			`alter table "session" alter column "user_id" type text using ("user_id"::text);`,
		);

		this.addSql(
			`alter table "session" drop constraint "session_user_id_foreign";`,
		);

		this.addSql(
			`alter table "member" alter column "user_id" type text using ("user_id"::text);`,
		);

		this.addSql(
			`alter table "member" drop constraint "member_user_id_foreign";`,
		);

		this.addSql(
			`alter table "invitation" alter column "inviter_id" type text using ("inviter_id"::text);`,
		);

		this.addSql(
			`alter table "invitation" drop constraint "invitation_inviter_id_foreign";`,
		);

		this.addSql(
			`alter table "image" alter column "uploader_id" type text using ("uploader_id"::text);`,
		);

		this.addSql(
			`alter table "image" drop constraint "image_uploader_id_foreign";`,
		);

		this.addSql(
			`alter table "shooter_profile" alter column "user_id" type text using ("user_id"::text);`,
		);

		this.addSql(
			`alter table "shooter_profile" drop constraint "shooter_profile_user_id_foreign";`,
		);

		this.addSql(
			`alter table "account" alter column "user_id" type text using ("user_id"::text);`,
		);

		this.addSql(
			`alter table "account" drop constraint "account_user_id_foreign";`,
		);

		this.addSql(`alter table "user" alter column "id" drop default;`);
		this.addSql(
			`alter table "user" alter column "id" type text using ("id"::text);`,
		);

		this.addSql(
			`alter table "session" alter column "user_id" type text using ("user_id"::text);`,
		);
		this.addSql(
			`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`,
		);

		this.addSql(
			`alter table "member" alter column "user_id" type text using ("user_id"::text);`,
		);
		this.addSql(
			`alter table "member" add constraint "member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`,
		);

		this.addSql(
			`alter table "invitation" alter column "inviter_id" type text using ("inviter_id"::text);`,
		);
		this.addSql(
			`alter table "invitation" add constraint "invitation_inviter_id_foreign" foreign key ("inviter_id") references "user" ("id") on update cascade on delete cascade;`,
		);

		this.addSql(
			`alter table "image" alter column "uploader_id" type text using ("uploader_id"::text);`,
		);
		this.addSql(
			`alter table "image" add constraint "image_uploader_id_foreign" foreign key ("uploader_id") references "user" ("id") on update cascade;`,
		);

		this.addSql(
			`alter table "shooter_profile" alter column "user_id" type text using ("user_id"::text);`,
		);
		this.addSql(
			`alter table "shooter_profile" add constraint "shooter_profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`,
		);

		this.addSql(
			`alter table "account" alter column "user_id" type text using ("user_id"::text);`,
		);
		this.addSql(
			`alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`,
		);
	}
}
