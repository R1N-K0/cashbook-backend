import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRole1756099799992 implements MigrationInterface {
  name = 'AddRole1756099799992'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('regular', 'admin')`,
    )
    await queryRunner.query(
      `ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'regular'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`)
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
  }
}
