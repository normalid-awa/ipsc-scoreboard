import { Migration } from '@mikro-orm/migrations';

export class Migration20251209142856_UpdateClubOwnerAsMTo1Relation extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "join_club_request" drop constraint "join_club_request_club_id_foreign";`);
    this.addSql(`alter table "join_club_request" drop constraint "join_club_request_from_id_foreign";`);

    this.addSql(`alter table "club" drop constraint "club_owner_id_unique";`);

    this.addSql(`alter table "join_club_request" alter column "club_id" type int using ("club_id"::int);`);
    this.addSql(`alter table "join_club_request" alter column "club_id" set not null;`);
    this.addSql(`alter table "join_club_request" alter column "from_id" type int using ("from_id"::int);`);
    this.addSql(`alter table "join_club_request" alter column "from_id" set not null;`);
    this.addSql(`alter table "join_club_request" add constraint "join_club_request_club_id_foreign" foreign key ("club_id") references "club" ("id") on update cascade;`);
    this.addSql(`alter table "join_club_request" add constraint "join_club_request_from_id_foreign" foreign key ("from_id") references "shooter_profile" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "join_club_request" drop constraint "join_club_request_club_id_foreign";`);
    this.addSql(`alter table "join_club_request" drop constraint "join_club_request_from_id_foreign";`);

    this.addSql(`alter table "club" add constraint "club_owner_id_unique" unique ("owner_id");`);

    this.addSql(`alter table "join_club_request" alter column "club_id" type int4 using ("club_id"::int4);`);
    this.addSql(`alter table "join_club_request" alter column "club_id" drop not null;`);
    this.addSql(`alter table "join_club_request" alter column "from_id" type int4 using ("from_id"::int4);`);
    this.addSql(`alter table "join_club_request" alter column "from_id" drop not null;`);
    this.addSql(`alter table "join_club_request" add constraint "join_club_request_club_id_foreign" foreign key ("club_id") references "club" ("id") on update no action on delete cascade;`);
    this.addSql(`alter table "join_club_request" add constraint "join_club_request_from_id_foreign" foreign key ("from_id") references "shooter_profile" ("id") on update no action on delete cascade;`);

    this.addSql(`alter type "shooter_profile_sport" add value if not exists '3-Gun' after 'USPSA';`);
  }

}
