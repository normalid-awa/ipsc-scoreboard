import { Migration } from '@mikro-orm/migrations';

export class Migration20250901144639_RemoveUsernamePlugin extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_username_key";`);
    this.addSql(`alter table "user" drop column "username", drop column "displayUsername";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" add column "username" text null, add column "displayUsername" text null;`);
    this.addSql(`alter table "user" add constraint "user_username_key" unique ("username");`);
  }

}
