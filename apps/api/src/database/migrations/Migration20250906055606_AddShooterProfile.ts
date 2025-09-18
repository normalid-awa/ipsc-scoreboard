import { Migration } from '@mikro-orm/migrations';

export class Migration20250906055606_AddShooterProfile extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "shooter_profile_sport" as enum ('IPSC', 'IDPA', 'AAIPSC', 'USPSA', '3-Gun');`);
    this.addSql(`create table "shooter_profile" ("id" serial primary key, "deleted_at" timestamptz null, "sport" "shooter_profile_sport" not null, "identifier" varchar(255) not null, "user_id" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`alter table "shooter_profile" add constraint "shooter_profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "shooter_profile" cascade;`);

    this.addSql(`drop type "shooter_profile_sport";`);
  }

}
