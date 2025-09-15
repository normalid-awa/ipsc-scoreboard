import { Migration } from '@mikro-orm/migrations';

export class Migration20250915111035_AddUploaderPropertyForImage extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "image" add column "uploader_id" text not null;`);
    this.addSql(`alter table "image" add constraint "image_uploader_id_foreign" foreign key ("uploader_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "image" drop constraint "image_uploader_id_foreign";`);

    this.addSql(`alter table "image" drop column "uploader_id";`);
  }

}
