import type { MigrationInterface, QueryRunner } from 'typeorm'

export class FixTransactionsColumn1758165111554 implements MigrationInterface {
  name = 'FixTransactionsColumn1758165111554'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_472989ddac60450f0fc3eb60db5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_472989ddac60450f0fc3eb60db5" FOREIGN KEY ("updated_user_id") REFERENCES "transaction_users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_472989ddac60450f0fc3eb60db5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_472989ddac60450f0fc3eb60db5" FOREIGN KEY ("updated_user_id") REFERENCES "transaction_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }
}
