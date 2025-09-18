import { Migration } from '@mikro-orm/migrations';

export class Migration20250915095014_AddImageEntity extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "image" ("uuid" uuid not null default gen_random_uuid(), "filename" varchar(255) not null, "mimetype" varchar(255) not null, "size" int not null, "hash" varchar(255) not null, constraint "image_pkey" primary key ("uuid"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "image" cascade;`);
  }

}
