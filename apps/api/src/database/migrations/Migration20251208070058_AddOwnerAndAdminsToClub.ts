import { Migration } from '@mikro-orm/migrations';

export class Migration20251208070058_AddOwnerAndAdminsToClub extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "club_admin_id" int null;`);
    this.addSql(`alter table "user" add constraint "user_club_admin_id_foreign" foreign key ("club_admin_id") references "club" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "club" add column "owner_id" uuid not null;`);
    this.addSql(`alter table "club" add constraint "club_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "club" add constraint "club_owner_id_unique" unique ("owner_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_club_admin_id_foreign";`);

    this.addSql(`alter table "club" drop constraint "club_owner_id_foreign";`);

    this.addSql(`alter table "user" drop column "club_admin_id";`);

    this.addSql(`alter table "club" drop constraint "club_owner_id_unique";`);
    this.addSql(`alter table "club" drop column "owner_id";`);
  }

}
