import type { MigrationInterface, QueryRunner } from 'typeorm'

export class InitSchema1756094931284 implements MigrationInterface {
  name = 'InitSchema1756094931284'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "closing_logs" ("id" BIGSERIAL NOT NULL, "closing_date" date NOT NULL, "processed_at" TIMESTAMP, "user_id" bigint, CONSTRAINT "PK_c6bf7a80a22d1f660b0ca0b7ee9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "transactions_receipts" ("id" BIGSERIAL NOT NULL, "s3_url" character varying NOT NULL, "file_name" character varying NOT NULL, "mime_type" character varying NOT NULL, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" bigint, CONSTRAINT "PK_9bde37985fede4031af98152e4d" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" BIGSERIAL NOT NULL, "date" date NOT NULL, "description" character varying NOT NULL, "memo" text, "amount" integer NOT NULL, "created_user" character varying NOT NULL, "updated_user" character varying NOT NULL, "editable" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" bigint, "category_id" bigint, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "name" character varying(255) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "closing_day" smallint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"`,
    )
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "id"`)
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "id" BIGSERIAL NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(
      `ALTER TABLE "closing_logs" ADD CONSTRAINT "FK_78a523fe56fc141127595571312" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "transactions_receipts" ADD CONSTRAINT "FK_51565c480b9c61779adf9ef4161" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_c9e41213ca42d50132ed7ab2b0f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "transactions_receipts" DROP CONSTRAINT "FK_51565c480b9c61779adf9ef4161"`,
    )
    await queryRunner.query(
      `ALTER TABLE "closing_logs" DROP CONSTRAINT "FK_78a523fe56fc141127595571312"`,
    )
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"`,
    )
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "categories" ADD "id" SERIAL NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")`,
    )
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TABLE "transactions"`)
    await queryRunner.query(`DROP TABLE "transactions_receipts"`)
    await queryRunner.query(`DROP TABLE "closing_logs"`)
  }
}
