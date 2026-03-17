import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773739583540 implements MigrationInterface {
  name = 'Migration1773739583540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."connections_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "connections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."connections_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" uuid, "receiverId" uuid, CONSTRAINT "PK_0a1f844af3122354cbd487a8d03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "educations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "school" character varying NOT NULL, "degree" character varying NOT NULL, "fieldOfStudy" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_09d2f29e7f6f31f5c01d79d2dbf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "experiences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "company" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_884f0913a63882712ea578e7c85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE ("name"), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "skillId" uuid, CONSTRAINT "PK_4d0a72117fbf387752dbc8506af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "followerId" uuid, "followingId" uuid, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "profilePicture" character varying, "coverPicture" character varying, "headline" character varying, "about" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "outbox_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "aggregateType" character varying NOT NULL, "aggregateId" character varying NOT NULL, "eventType" character varying NOT NULL, "payload" jsonb NOT NULL, "processed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6689a16c00d09b8089f6237f1d2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inbox_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventType" character varying NOT NULL, "payload" jsonb NOT NULL, "processed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_774766668269f8c2c12f13649fc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "connections" ADD CONSTRAINT "FK_871860083f7521d7cb204946eb2" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "connections" ADD CONSTRAINT "FK_7a7cc4dfe8b8fe397b1faf6698a" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" ADD CONSTRAINT "FK_86e26478ad7a3d8543cfb922358" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "experiences" ADD CONSTRAINT "FK_bb3ad7f8190c033791e9f1af1ea" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_skills" ADD CONSTRAINT "FK_60177dd93dcdc055e4eaa93bade" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_skills" ADD CONSTRAINT "FK_b19f190afaada3852e0f56566bc" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" ADD CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" ADD CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "follows" DROP CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" DROP CONSTRAINT "FK_fdb91868b03a2040db408a53331"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_skills" DROP CONSTRAINT "FK_b19f190afaada3852e0f56566bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_skills" DROP CONSTRAINT "FK_60177dd93dcdc055e4eaa93bade"`,
    );
    await queryRunner.query(
      `ALTER TABLE "experiences" DROP CONSTRAINT "FK_bb3ad7f8190c033791e9f1af1ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "educations" DROP CONSTRAINT "FK_86e26478ad7a3d8543cfb922358"`,
    );
    await queryRunner.query(
      `ALTER TABLE "connections" DROP CONSTRAINT "FK_7a7cc4dfe8b8fe397b1faf6698a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "connections" DROP CONSTRAINT "FK_871860083f7521d7cb204946eb2"`,
    );
    await queryRunner.query(`DROP TABLE "inbox_events"`);
    await queryRunner.query(`DROP TABLE "outbox_events"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "follows"`);
    await queryRunner.query(`DROP TABLE "user_skills"`);
    await queryRunner.query(`DROP TABLE "skills"`);
    await queryRunner.query(`DROP TABLE "experiences"`);
    await queryRunner.query(`DROP TABLE "educations"`);
    await queryRunner.query(`DROP TABLE "connections"`);
    await queryRunner.query(`DROP TYPE "public"."connections_status_enum"`);
  }
}
