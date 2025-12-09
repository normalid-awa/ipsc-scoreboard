import { Migration } from "@mikro-orm/migrations";

export class Migration20251209095452_AddSportFieldToClub extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`create type "sports" as enum ('IPSC', 'IDPA', 'USPSA', 'AAIPSC');`,
		);
		this.addSql(
			`alter table "join_club_request" drop constraint "join_club_request_club_id_foreign";`,
		);
		this.addSql(
			`alter table "join_club_request" drop constraint "join_club_request_from_id_foreign";`,
		);

		this.addSql(
			`alter table "club" add column "sport" "sports" not null default 'IPSC';`,
		);

		this.addSql(
			`alter table "join_club_request" alter column "club_id" type int using ("club_id"::int);`,
		);
		this.addSql(
			`alter table "join_club_request" alter column "club_id" drop not null;`,
		);
		this.addSql(
			`alter table "join_club_request" alter column "from_id" type int using ("from_id"::int);`,
		);
		this.addSql(
			`alter table "join_club_request" alter column "from_id" drop not null;`,
		);
		this.addSql(
			`alter table "join_club_request" add constraint "join_club_request_club_id_foreign" foreign key ("club_id") references "club" ("id") on delete cascade;`,
		);
		this.addSql(
			`alter table "join_club_request" add constraint "join_club_request_from_id_foreign" foreign key ("from_id") references "shooter_profile" ("id") on delete cascade;`,
		);

		this.addSql(`alter table "club" alter column "sport" drop default;`);
	}

	override async down(): Promise<void> {
		this.addSql(
			`alter table "join_club_request" drop constraint "join_club_request_club_id_foreign";`,
		);
		this.addSql(
			`alter table "join_club_request" drop constraint "join_club_request_from_id_foreign";`,
		);

		this.addSql(`alter table "club" drop column "sport";`);

		this.addSql(
			`alter table "join_club_request" alter column "club_id" type int using ("club_id"::int);`,
		);
		this.addSql(
			`alter table "join_club_request" alter column "club_id" set not null;`,
		);
		this.addSql(
			`alter table "join_club_request" alter column "from_id" type int using ("from_id"::int);`,
		);
		this.addSql(
			`alter table "join_club_request" alter column "from_id" set not null;`,
		);
		this.addSql(
			`alter table "join_club_request" add constraint "join_club_request_club_id_foreign" foreign key ("club_id") references "club" ("id") on update cascade;`,
		);
		this.addSql(
			`alter table "join_club_request" add constraint "join_club_request_from_id_foreign" foreign key ("from_id") references "shooter_profile" ("id") on update cascade;`,
		);

		this.addSql(`drop type "sports";`);
	}
}
