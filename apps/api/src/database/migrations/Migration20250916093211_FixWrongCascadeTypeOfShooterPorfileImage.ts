import { Migration } from '@mikro-orm/migrations';

export class Migration20250916093211_FixWrongCascadeTypeOfShooterPorfileImage extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "shooter_profile" drop constraint "shooter_profile_image_uuid_foreign";`);

    this.addSql(`alter table "shooter_profile" add constraint "shooter_profile_image_uuid_foreign" foreign key ("image_uuid") references "image" ("uuid") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "shooter_profile" drop constraint "shooter_profile_image_uuid_foreign";`);

    this.addSql(`alter table "shooter_profile" add constraint "shooter_profile_image_uuid_foreign" foreign key ("image_uuid") references "image" ("uuid") on delete cascade;`);
  }

}
