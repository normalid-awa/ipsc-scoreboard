import { Migration } from '@mikro-orm/migrations';

export class Migration20250823143237 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "organization" ("id" text not null, "name" text not null, "slug" text not null, "logo" text null, "createdAt" timestamp(6) not null, "metadata" text null, constraint "organization_pkey" primary key ("id"));`);
    this.addSql(`alter table "organization" add constraint "organization_slug_key" unique ("slug");`);

    this.addSql(`create table "user" ("id" text not null, "name" text not null, "email" text not null, "emailVerified" boolean not null, "image" text null, "createdAt" timestamp(6) not null default CURRENT_TIMESTAMP, "updatedAt" timestamp(6) not null default CURRENT_TIMESTAMP, "username" text null, "displayUsername" text null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_key" unique ("email");`);
    this.addSql(`alter table "user" add constraint "user_username_key" unique ("username");`);

    this.addSql(`create table "session" ("id" text not null, "expiresAt" timestamp(6) not null, "token" text not null, "createdAt" timestamp(6) not null, "updatedAt" timestamp(6) not null, "ipAddress" text null, "userAgent" text null, "user_id" text not null, "activeOrganizationId" text null, constraint "session_pkey" primary key ("id"));`);
    this.addSql(`alter table "session" add constraint "session_token_key" unique ("token");`);

    this.addSql(`create table "member" ("id" text not null, "organization_id" text not null, "user_id" text not null, "role" text not null, "createdAt" timestamp(6) not null, constraint "member_pkey" primary key ("id"));`);

    this.addSql(`create table "invitation" ("id" text not null, "organization_id" text not null, "email" text not null, "role" text null, "status" text not null, "expiresAt" timestamp(6) not null, "inviter_id" text not null, constraint "invitation_pkey" primary key ("id"));`);

    this.addSql(`create table "account" ("id" text not null, "accountId" text not null, "providerId" text not null, "user_id" text not null, "accessToken" text null, "refreshToken" text null, "idToken" text null, "accessTokenExpiresAt" timestamp(6) null, "refreshTokenExpiresAt" timestamp(6) null, "scope" text null, "password" text null, "createdAt" timestamp(6) not null, "updatedAt" timestamp(6) not null, constraint "account_pkey" primary key ("id"));`);

    this.addSql(`create table "verification" ("id" text not null, "identifier" text not null, "value" text not null, "expiresAt" timestamp(6) not null, "createdAt" timestamp(6) null default CURRENT_TIMESTAMP, "updatedAt" timestamp(6) null default CURRENT_TIMESTAMP, constraint "verification_pkey" primary key ("id"));`);

    this.addSql(`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "member" add constraint "member_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "member" add constraint "member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "invitation" add constraint "invitation_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "invitation" add constraint "invitation_inviter_id_foreign" foreign key ("inviter_id") references "user" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
  }

}
