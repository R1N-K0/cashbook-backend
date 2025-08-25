import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCategoriesEntity1756085657017 implements MigrationInterface {
  name = 'AddCategoriesEntity1756085657017'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."categories_type_enum" AS ENUM('income', 'expense')`,
    )
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "type" "public"."categories_type_enum" NOT NULL DEFAULT 'income', "color" character varying(7) NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "categories"`)
    await queryRunner.query(`DROP TYPE "public"."categories_type_enum"`)
  }
}
