import { MigrationInterface, QueryRunner } from "typeorm";

export class FailedEventsTable1769546067800 implements MigrationInterface {
    name = 'FailedEventsTable1769546067800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."failed_events_status_enum" AS ENUM('PENDING', 'RETRIED', 'FAILED', 'RESOLVED')`);
        await queryRunner.query(`CREATE TABLE "failed_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_name" character varying NOT NULL, "event_source" character varying NOT NULL, "payload" jsonb NOT NULL, "error_message" text NOT NULL, "error_stack" text, "status" "public"."failed_events_status_enum" NOT NULL DEFAULT 'PENDING', "attempts" integer NOT NULL DEFAULT '0', "max_attempts" integer NOT NULL DEFAULT '3', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "last_attempt_at" TIMESTAMP, "resolved_at" TIMESTAMP, CONSTRAINT "PK_ee75f8d29b0adf456ded4e8c8e7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "failed_events"`);
        await queryRunner.query(`DROP TYPE "public"."failed_events_status_enum"`);
    }

}
