import { Migration } from '@mikro-orm/migrations';

export class Migration20251208085247_AddJoinClubRequestEntity extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "join_club_request" ("uuid" uuid not null default gen_random_uuid(), "club_id" int not null, "from_id" int not null, "created_at" timestamptz not null, constraint "join_club_request_pkey" primary key ("uuid"));`);
    this.addSql(`alter table "join_club_request" add constraint "join_club_request_from_id_unique" unique ("from_id");`);

    this.addSql(`alter table "join_club_request" add constraint "join_club_request_club_id_foreign" foreign key ("club_id") references "club" ("id") on update cascade;`);
    this.addSql(`alter table "join_club_request" add constraint "join_club_request_from_id_foreign" foreign key ("from_id") references "shooter_profile" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "join_club_request" cascade;`);
  }

}
