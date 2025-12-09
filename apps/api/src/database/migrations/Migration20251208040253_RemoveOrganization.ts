import { Migration } from '@mikro-orm/migrations';

export class Migration20251208040253_RemoveOrganization extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "member" drop constraint "member_organization_id_foreign";`);

    this.addSql(`alter table "invitation" drop constraint "invitation_organization_id_foreign";`);

    this.addSql(`drop table if exists "organization" cascade;`);

    this.addSql(`drop table if exists "member" cascade;`);

    this.addSql(`drop table if exists "invitation" cascade;`);

    this.addSql(`alter table "session" drop column "active_organization";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "organization" ("id" uuid not null default gen_random_uuid(), "name" text not null, "slug" text not null, "logo" text null, "createdAt" timestamp(6) not null, "metadata" text null, constraint "organization_pkey" primary key ("id"));`);
    this.addSql(`alter table "organization" add constraint "organization_slug_key" unique ("slug");`);

    this.addSql(`create table "member" ("id" uuid not null default gen_random_uuid(), "organization_id" uuid not null, "user_id" uuid not null, "role" text not null, "createdAt" timestamp(6) not null, constraint "member_pkey" primary key ("id"));`);

    this.addSql(`create table "invitation" ("id" uuid not null default gen_random_uuid(), "organization_id" uuid not null, "email" text not null, "role" text null, "status" text not null, "expiresAt" timestamp(6) not null, "inviter_id" uuid not null, constraint "invitation_pkey" primary key ("id"));`);

    this.addSql(`alter table "member" add constraint "member_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "member" add constraint "member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "invitation" add constraint "invitation_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "invitation" add constraint "invitation_inviter_id_foreign" foreign key ("inviter_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "session" add column "active_organization" text null;`);
  }

}
