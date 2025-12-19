import { Migration } from '@mikro-orm/migrations';

export class Migration20251208080908_AddClubEntity extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "club" ("id" serial primary key, "name" varchar(255) not null, "description" text null, "third_party_links" jsonb not null, "icon_uuid" uuid not null, "banner_uuid" uuid null, "owner_id" uuid not null, "created_at" timestamptz not null);`);
    this.addSql(`alter table "club" add constraint "club_icon_uuid_unique" unique ("icon_uuid");`);
    this.addSql(`alter table "club" add constraint "club_banner_uuid_unique" unique ("banner_uuid");`);
    this.addSql(`alter table "club" add constraint "club_owner_id_unique" unique ("owner_id");`);

    this.addSql(`alter table "club" add constraint "club_icon_uuid_foreign" foreign key ("icon_uuid") references "image" ("uuid") on update cascade;`);
    this.addSql(`alter table "club" add constraint "club_banner_uuid_foreign" foreign key ("banner_uuid") references "image" ("uuid") on update cascade on delete set null;`);
    this.addSql(`alter table "club" add constraint "club_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "user" add column "club_admin_id" int null;`);
    this.addSql(`alter table "user" add constraint "user_club_admin_id_foreign" foreign key ("club_admin_id") references "club" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "shooter_profile" add column "club_id" int null;`);
    this.addSql(`alter table "shooter_profile" add constraint "shooter_profile_club_id_foreign" foreign key ("club_id") references "club" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_club_admin_id_foreign";`);

    this.addSql(`alter table "shooter_profile" drop constraint "shooter_profile_club_id_foreign";`);

    this.addSql(`drop table if exists "club" cascade;`);

    this.addSql(`alter type "shooter_profile_sport" add value if not exists '3-Gun' after 'USPSA';`);

    this.addSql(`alter table "shooter_profile" drop column "club_id";`);

    this.addSql(`alter table "user" drop column "club_admin_id";`);
  }

}
