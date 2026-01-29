import { MigrationInterface, QueryRunner } from "typeorm";

export class UserDocumentEncrypted1769645480714 implements MigrationInterface {
    name = 'UserDocumentEncrypted1769645480714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_71fdad8489d3d818ec393e6eb14"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "document"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "document_hash" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_431d6ea7ae5be6b1be859b18c18" UNIQUE ("document_hash")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "document_crypt" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_a681158730426fd85b526c6aace" UNIQUE ("document_crypt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_a681158730426fd85b526c6aace"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "document_crypt"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_431d6ea7ae5be6b1be859b18c18"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "document_hash"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "document" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_71fdad8489d3d818ec393e6eb14" UNIQUE ("document")`);
    }

}
