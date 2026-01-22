import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1769047633068 implements MigrationInterface {
    name = 'Initial1769047633068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_method_enum" AS ENUM('pix')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('pending', 'approved', 'failed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."payment_gateway_enum" AS ENUM('woovi', 'pagseguro', 'stripe', 'abacatepay')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "method" "public"."payment_method_enum" NOT NULL, "amount" integer NOT NULL, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending', "transaction_reference" character varying NOT NULL, "description" character varying, "gateway" "public"."payment_gateway_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" uuid NOT NULL, CONSTRAINT "REL_f5221735ace059250daac9d980" UNIQUE ("order_id"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "buyer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying, "phone" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" uuid NOT NULL, CONSTRAINT "REL_580a8cf29915aba5401fecdb4b" UNIQUE ("order_id"), CONSTRAINT "PK_0480fc3c7289846a31b8e1bc503" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ticket_type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid NOT NULL, CONSTRAINT "PK_757d4830df239a662399edf9f24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_item_id" uuid NOT NULL, "batch_id" uuid NOT NULL, "ticket_type_id" uuid NOT NULL, CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."batch_status_enum" AS ENUM('SCHEDULED', 'ACTIVE', 'SOLD_OUT', 'FINISHED')`);
        await queryRunner.query(`CREATE TABLE "batch" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "amount" integer NOT NULL, "quantity" integer NOT NULL, "sold" integer NOT NULL DEFAULT '0', "start_at" TIMESTAMP WITH TIME ZONE NOT NULL, "end_at" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."batch_status_enum" NOT NULL DEFAULT 'SCHEDULED', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid NOT NULL, "ticket_type_id" uuid NOT NULL, CONSTRAINT "PK_57da3b830b57bec1fd329dcaf43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_amount" integer NOT NULL, "ticket_quantity" smallint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" uuid NOT NULL, "batch_id" uuid NOT NULL, "ticket_type_id" uuid NOT NULL, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('pending', 'confirmed', 'failed', 'refund')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "total_amount" integer NOT NULL, "platform_fee_amount" integer NOT NULL, "gateway_fee_amount" integer NOT NULL, "event_organizer_amount_net" integer NOT NULL, "ticket_quantity" smallint NOT NULL, "transaction_reference" character varying NOT NULL, "status" "public"."order_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" uuid NOT NULL, CONSTRAINT "UQ_2d33c261d42daeedbe99d57568c" UNIQUE ("transaction_reference"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."event_status_enum" AS ENUM('draft', 'published', 'finished', 'canceled')`);
        await queryRunner.query(`CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying(2) NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "place_name" character varying, "slug" character varying NOT NULL, "start_at" TIMESTAMP WITH TIME ZONE NOT NULL, "end_at" TIMESTAMP WITH TIME ZONE NOT NULL, "entrance_limit_at" TIMESTAMP WITH TIME ZONE, "time_zone" character varying NOT NULL DEFAULT 'America/Sao_Paulo', "capacity" integer NOT NULL, "status" "public"."event_status_enum" NOT NULL DEFAULT 'draft', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "organizer_user_id" uuid NOT NULL, CONSTRAINT "UQ_9d0d870657c4fac264cdca048e8" UNIQUE ("slug"), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "withdraw" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "pix_key" character varying NOT NULL, "amount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_5c172f81689173f75bf5906ef22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_auth_provider_enum" AS ENUM('local', 'google')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "document" character varying, "birth_date" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "pix_key" character varying, "active" boolean NOT NULL DEFAULT true, "password" character varying, "picture_url" character varying, "auth_provider" "public"."user_auth_provider_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_71fdad8489d3d818ec393e6eb14" UNIQUE ("document"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_c532291a1c62b6583059ebeda11" UNIQUE ("pix_key"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "logout" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bd44cadf9f1343760c271ddacb9" UNIQUE ("token"), CONSTRAINT "PK_3c94c20f1447defd40481d1aca3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_f5221735ace059250daac9d9803" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "buyer" ADD CONSTRAINT "FK_580a8cf29915aba5401fecdb4b1" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket_type" ADD CONSTRAINT "FK_0af363f9f7cc449c18178dfe0a2" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_0dcd9e997adb5d097c0a2845905" FOREIGN KEY ("order_item_id") REFERENCES "order_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_0649ee23fc72e7de3643d577481" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_af51af23249ad05ee17dc48019a" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "batch" ADD CONSTRAINT "FK_f4d88f0dbe905edc5fae76859e3" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "batch" ADD CONSTRAINT "FK_c20a6e4eb144721e80cefa1ab51" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_10d65a7208c7c4b53332a3bc25e" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_9c6510c4f3e28051172c038a090" FOREIGN KEY ("ticket_type_id") REFERENCES "ticket_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_394b0d7613180ebee9028e9aaa1" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_b9d2587d09e9c1a16cea73352e5" FOREIGN KEY ("organizer_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdraw" ADD CONSTRAINT "FK_05d6371b1cb3202d1ae180f16b6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw" DROP CONSTRAINT "FK_05d6371b1cb3202d1ae180f16b6"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_b9d2587d09e9c1a16cea73352e5"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_394b0d7613180ebee9028e9aaa1"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_9c6510c4f3e28051172c038a090"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_10d65a7208c7c4b53332a3bc25e"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
        await queryRunner.query(`ALTER TABLE "batch" DROP CONSTRAINT "FK_c20a6e4eb144721e80cefa1ab51"`);
        await queryRunner.query(`ALTER TABLE "batch" DROP CONSTRAINT "FK_f4d88f0dbe905edc5fae76859e3"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_af51af23249ad05ee17dc48019a"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_0649ee23fc72e7de3643d577481"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_0dcd9e997adb5d097c0a2845905"`);
        await queryRunner.query(`ALTER TABLE "ticket_type" DROP CONSTRAINT "FK_0af363f9f7cc449c18178dfe0a2"`);
        await queryRunner.query(`ALTER TABLE "buyer" DROP CONSTRAINT "FK_580a8cf29915aba5401fecdb4b1"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_f5221735ace059250daac9d9803"`);
        await queryRunner.query(`DROP TABLE "logout"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_auth_provider_enum"`);
        await queryRunner.query(`DROP TABLE "withdraw"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TYPE "public"."event_status_enum"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "batch"`);
        await queryRunner.query(`DROP TYPE "public"."batch_status_enum"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`DROP TABLE "ticket_type"`);
        await queryRunner.query(`DROP TABLE "buyer"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_gateway_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_method_enum"`);
    }

}
