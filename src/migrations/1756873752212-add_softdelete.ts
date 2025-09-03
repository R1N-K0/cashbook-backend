import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AddSoftdelete1756873752212 implements MigrationInterface {
  name = 'AddSoftdelete1756873752212'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "deletedDate" TIMESTAMP`,
    )
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "deletedDate" TIMESTAMP`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP COLUMN "deletedDate"`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "deletedDate"`,
    )
  }
}
