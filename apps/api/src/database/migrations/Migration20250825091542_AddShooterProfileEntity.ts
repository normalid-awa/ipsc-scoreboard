import { Migration } from '@mikro-orm/migrations';

export class Migration20250825091542_AddShooterProfileEntity extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "shooter_profile" ("id" uuid not null default gen_random_uuid(), "user_id" text null, "sport" text check ("sport" in ('IPSC', 'IDPA', 'USPSA', 'AAIPSC', '3-Gun')) not null, "identifier" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "shooter_profile_pkey" primary key ("id"));`);
    this.addSql(`alter table "shooter_profile" add constraint "shooter_profile_user_id_sport_unique" unique ("user_id", "sport");`);
    this.addSql(`alter table "shooter_profile" add constraint "shooter_profile_sport_identifier_unique" unique ("sport", "identifier");`);

    this.addSql(`alter table "shooter_profile" add constraint "shooter_profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "session" rename column "activeOrganizationId" to "active_organization";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "shooter_profile" cascade;`);

    this.addSql(`alter table "session" rename column "active_organization" to "activeOrganizationId";`);
  }

}
