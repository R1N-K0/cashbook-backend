import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AddColumns1759374223584 implements MigrationInterface {
  name = 'AddColumns1759374223584'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "title" character varying(255) NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD "status" boolean NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "status"`)
    await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "title"`)
  }
}
