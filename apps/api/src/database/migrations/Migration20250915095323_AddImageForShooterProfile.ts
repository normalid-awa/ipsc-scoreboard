import { Migration } from '@mikro-orm/migrations';

export class Migration20250915095323_AddImageForShooterProfile extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "shooter_profile" add column "image_uuid" uuid null;`);
    this.addSql(`alter table "shooter_profile" add constraint "shooter_profile_image_uuid_foreign" foreign key ("image_uuid") references "image" ("uuid") on update cascade on delete cascade;`);
    this.addSql(`alter table "shooter_profile" add constraint "shooter_profile_image_uuid_unique" unique ("image_uuid");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "shooter_profile" drop constraint "shooter_profile_image_uuid_foreign";`);

    this.addSql(`alter table "shooter_profile" drop constraint "shooter_profile_image_uuid_unique";`);
    this.addSql(`alter table "shooter_profile" drop column "image_uuid";`);
  }

}
