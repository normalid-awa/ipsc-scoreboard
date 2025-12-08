import { Migration } from '@mikro-orm/migrations';

export class Migration20251208071607_FixClubAdminCollectionType extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "club" drop constraint "club_banner_uuid_foreign";`);

    this.addSql(`alter table "club" alter column "banner_uuid" drop default;`);
    this.addSql(`alter table "club" alter column "banner_uuid" type uuid using ("banner_uuid"::text::uuid);`);
    this.addSql(`alter table "club" alter column "banner_uuid" drop not null;`);
    this.addSql(`alter table "club" add constraint "club_banner_uuid_foreign" foreign key ("banner_uuid") references "image" ("uuid") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "club" drop constraint "club_banner_uuid_foreign";`);

    this.addSql(`alter table "club" alter column "banner_uuid" drop default;`);
    this.addSql(`alter table "club" alter column "banner_uuid" type uuid using ("banner_uuid"::text::uuid);`);
    this.addSql(`alter table "club" alter column "banner_uuid" set not null;`);
    this.addSql(`alter table "club" add constraint "club_banner_uuid_foreign" foreign key ("banner_uuid") references "image" ("uuid") on update cascade;`);
  }

}
