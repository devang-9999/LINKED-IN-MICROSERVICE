import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1773586488841 implements MigrationInterface {
    name = 'Migration1773586488841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "outbox_events" ADD "aggregateType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "outbox_events" ADD "aggregateId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "outbox_events" DROP COLUMN "aggregateId"`);
        await queryRunner.query(`ALTER TABLE "outbox_events" DROP COLUMN "aggregateType"`);
    }

}
