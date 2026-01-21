import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteTicketBatchTable1769009872087 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`ticket_batch\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
