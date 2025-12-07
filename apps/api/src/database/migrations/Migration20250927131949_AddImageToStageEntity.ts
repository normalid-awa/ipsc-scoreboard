import { Migration } from "@mikro-orm/migrations";

export class Migration20250927131949_AddImageToStageEntity extends Migration {
	override async up(): Promise<void> {
		this.addSql(
			`create table "stage_image" ("stage_id" int null, "image_uuid" uuid not null, "order" int not null, constraint "stage_image_pkey" primary key ("stage_id", "image_uuid"));`,
		);

		this.addSql(
			`alter table "stage_image" add constraint "stage_image_stage_id_foreign" foreign key ("stage_id") references "stage" ("id") on update cascade on delete cascade;`,
		);
		this.addSql(
			`alter table "stage_image" add constraint "stage_image_image_uuid_foreign" foreign key ("image_uuid") references "image" ("uuid") on update cascade;`,
		);

		this.addSql(
			`alter table "stage" drop constraint if exists "stage_type_check";`,
		);
		this.addSql(
			`alter table "stage" add column "created_at" timestamptz not null default now(), add column "updated_at" timestamptz not null default now();`,
		);
		this.addSql(
			`alter table "stage" alter column "created_at" drop default, alter column "updated_at" drop default;`,
		);
		this.addSql(
			`alter table "stage" add constraint "stage_type_check" check("type" in ('IPSC', 'IDPA', 'USPSA', 'AAIPSC'));`,
		);
	}

	override async down(): Promise<void> {
		this.addSql(`drop table if exists "stage_image" cascade;`);

		this.addSql(
			`alter table "stage" drop constraint if exists "stage_type_check";`,
		);

		this.addSql(
			`alter type "shooter_profile_sport" add value if not exists '3-Gun' after 'USPSA';`,
		);

		this.addSql(
			`alter table "stage" drop column "created_at", drop column "updated_at";`,
		);

		this.addSql(
			`alter table "stage" add constraint "stage_type_check" check("type" in ('Stage', 'IPSC', 'IDPA', 'AAIPSC', 'USPSA'));`,
		);
	}
}
