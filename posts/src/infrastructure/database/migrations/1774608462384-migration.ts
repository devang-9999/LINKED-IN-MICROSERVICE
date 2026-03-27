import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1774608462384 implements MigrationInterface {
  name = 'Migration1774608462384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "outbox_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "aggregateType" character varying NOT NULL, "aggregateId" character varying NOT NULL, "eventType" character varying NOT NULL, "payload" json NOT NULL, "processed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6689a16c00d09b8089f6237f1d2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "outbox_events"`);
  }
}
