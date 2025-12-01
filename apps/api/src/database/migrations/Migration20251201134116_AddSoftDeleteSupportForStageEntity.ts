import { Migration } from '@mikro-orm/migrations';

export class Migration20251201134116_AddSoftDeleteSupportForStageEntity extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "stage" add column "deleted_at" timestamptz null;`);
    this.addSql(`alter table "stage" alter column "minimum_rounds" type int using ("minimum_rounds"::int);`);
    this.addSql(`alter table "stage" alter column "minimum_rounds" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "stage" drop column "deleted_at";`);

    this.addSql(`alter table "stage" alter column "minimum_rounds" type int using ("minimum_rounds"::int);`);
    this.addSql(`alter table "stage" alter column "minimum_rounds" drop not null;`);
  }

}
