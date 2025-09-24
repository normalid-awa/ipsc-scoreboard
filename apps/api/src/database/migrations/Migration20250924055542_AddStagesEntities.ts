import { Migration } from '@mikro-orm/migrations';

export class Migration20250924055542_AddStagesEntities extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "uspsa_scoring_method" as enum ('Comstock', 'Virginia Count', 'Fixed Time');`);
    this.addSql(`create table "stage" ("id" serial primary key, "title" varchar(255) not null, "description" varchar(255) null, "walkthrough_time" int not null, "creator_id" uuid not null, "type" text check ("type" in ('Stage', 'IPSC', 'IDPA', 'AAIPSC', 'USPSA')) not null, "aaipsc_paper_targets" text[] null, "aaipsc_steel_targets" text[] null, "idpa_paper_targets" int null, "idpa_steel_targets" int null, "ipsc_paper_targets" text[] null, "ipsc_steel_targets" text[] null, "uspsa_paper_targets" text[] null, "uspsa_steel_targets" text[] null, "uspsa_scoring_method" "uspsa_scoring_method" null);`);
    this.addSql(`create index "stage_type_index" on "stage" ("type");`);

    this.addSql(`alter table "stage" add constraint "stage_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "stage" cascade;`);

    this.addSql(`alter type "shooter_profile_sport" add value if not exists '3-Gun' after 'USPSA';`);

    this.addSql(`drop type "uspsa_scoring_method";`);
  }

}
