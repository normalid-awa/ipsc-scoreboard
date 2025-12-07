import { Migration } from '@mikro-orm/migrations';

export class Migration20250928042856_MakeStageDescriptionBeText extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "stage" alter column "description" type text using ("description"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter type "shooter_profile_sport" add value if not exists '3-Gun' after 'USPSA';`);

    this.addSql(`alter table "stage" alter column "description" type varchar(255) using ("description"::varchar(255));`);
  }

}
