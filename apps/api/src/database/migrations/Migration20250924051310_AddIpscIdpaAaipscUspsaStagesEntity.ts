import { Migration } from '@mikro-orm/migrations';

export class Migration20250924051310_AddIpscIdpaAaipscUspsaStagesEntity extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "uspsa_scoring_method" as enum ('Comstock', 'Virginia Count', 'Fixed Time');`);
    this.addSql(`create table "stage" ("id" serial primary key, "title" varchar(255) not null, "description" varchar(255) not null, "creator_id" uuid not null, "type" text check ("type" in ('IPSC', 'IDPA', 'AAIPSC', 'USPSA')) not null, "paper_targets" int null, "steel_targets" int null, "scoring_method" "uspsa_scoring_method" null, "walkthrough_time" int null);`);
    this.addSql(`create index "stage_type_index" on "stage" ("type");`);

    this.addSql(`alter table "stage" add constraint "stage_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "stage" cascade;`);

    this.addSql(`drop type "uspsa_scoring_method";`);
  }

}
