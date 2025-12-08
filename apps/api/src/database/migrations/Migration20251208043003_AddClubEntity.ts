import { Migration } from '@mikro-orm/migrations';

export class Migration20251208043003_AddClubEntity extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "club" ("id" serial primary key, "name" varchar(255) not null, "description" text not null, "third_party_links" jsonb not null, "icon_uuid" uuid not null, "banner_uuid" uuid not null, "created_at" timestamptz not null);`);
    this.addSql(`alter table "club" add constraint "club_icon_uuid_unique" unique ("icon_uuid");`);
    this.addSql(`alter table "club" add constraint "club_banner_uuid_unique" unique ("banner_uuid");`);

    this.addSql(`alter table "club" add constraint "club_icon_uuid_foreign" foreign key ("icon_uuid") references "image" ("uuid") on update cascade;`);
    this.addSql(`alter table "club" add constraint "club_banner_uuid_foreign" foreign key ("banner_uuid") references "image" ("uuid") on update cascade;`);

    this.addSql(`alter table "shooter_profile" add column "club_id" int null;`);
    this.addSql(`alter table "shooter_profile" add constraint "shooter_profile_club_id_foreign" foreign key ("club_id") references "club" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "shooter_profile" drop constraint "shooter_profile_club_id_foreign";`);

    this.addSql(`drop table if exists "club" cascade;`);

    this.addSql(`alter table "shooter_profile" drop column "club_id";`);
  }

}
