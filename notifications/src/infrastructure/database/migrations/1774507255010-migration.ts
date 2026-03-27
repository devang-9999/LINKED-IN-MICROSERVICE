import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1774507255010 implements MigrationInterface {
  name = 'Migration1774507255010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inbox_events" ADD "receiverId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inbox_events" DROP COLUMN "receiverId"`,
    );
  }
}
