import type { MigrationInterface, QueryRunner } from 'typeorm'

export class FixTransactionUsersColumn1758163674282
  implements MigrationInterface
{
  name = 'FixTransactionUsersColumn1758163674282'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_users" ADD "limit_amount" integer NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_users" DROP COLUMN "limit_amount"`,
    )
  }
}
