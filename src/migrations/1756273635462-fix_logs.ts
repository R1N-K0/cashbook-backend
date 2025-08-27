import type { MigrationInterface, QueryRunner } from 'typeorm'

export class FixLogs1756273635462 implements MigrationInterface {
  name = 'FixLogs1756273635462'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "closing_logs" ALTER COLUMN "processed_at" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "closing_logs" ALTER COLUMN "processed_at" SET DEFAULT now()`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "closing_logs" ALTER COLUMN "processed_at" DROP DEFAULT`,
    )
    await queryRunner.query(
      `ALTER TABLE "closing_logs" ALTER COLUMN "processed_at" DROP NOT NULL`,
    )
  }
}
