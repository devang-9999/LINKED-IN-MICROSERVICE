import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774421861626 implements MigrationInterface {
    name = 'Migration1774421861626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('FOLLOW', 'CONNECTION_REQUEST', 'CONNECTION_ACCEPTED')`);
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "senderId" character varying NOT NULL, "receiverId" character varying NOT NULL, "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'FOLLOW', "message" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "senderName" character varying, "senderAvatar" character varying, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ddb7981cf939fe620179bfea33" ON "notifications" ("senderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d1e9b2452666de3b9b4d271cca" ON "notifications" ("receiverId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d1e9b2452666de3b9b4d271cca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ddb7981cf939fe620179bfea33"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    }

}
