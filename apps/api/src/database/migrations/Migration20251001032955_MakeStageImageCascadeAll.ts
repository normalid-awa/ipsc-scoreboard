import { Migration } from '@mikro-orm/migrations';

export class Migration20251001032955_MakeStageImageCascadeAll extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "stage_image" drop constraint "stage_image_image_uuid_foreign";`);

    this.addSql(`alter table "stage_image" add constraint "stage_image_image_uuid_foreign" foreign key ("image_uuid") references "image" ("uuid") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "stage_image" drop constraint "stage_image_image_uuid_foreign";`);

    this.addSql(`alter table "stage_image" add constraint "stage_image_image_uuid_foreign" foreign key ("image_uuid") references "image" ("uuid") on update cascade;`);
  }

}
