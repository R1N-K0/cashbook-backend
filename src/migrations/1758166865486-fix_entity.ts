import type { MigrationInterface, QueryRunner } from 'typeorm'

export class FixEntity1758166865486 implements MigrationInterface {
  name = 'FixEntity1758166865486'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_users" ADD "deletedDate" TIMESTAMP`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_users" DROP COLUMN "deletedDate"`,
    )
  }
}
