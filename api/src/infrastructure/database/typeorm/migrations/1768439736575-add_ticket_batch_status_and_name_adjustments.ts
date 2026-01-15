import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTicketBatchStatusAndNameAdjustments1768439736575 implements MigrationInterface {
    name = 'AddTicketBatchStatusAndNameAdjustments1768439736575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` DROP COLUMN \`ticket_quantity\``);
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` DROP COLUMN \`tickets_sold\``);
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` ADD \`quantity\` int UNSIGNED NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` ADD \`sold\` int UNSIGNED NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` ADD \`status\` enum ('SCHEDULED', 'ACTIVE', 'SOLD_OUT', 'FINISHED') NOT NULL DEFAULT 'SCHEDULED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` DROP COLUMN \`sold\``);
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` ADD \`tickets_sold\` int UNSIGNED NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` ADD \`ticket_quantity\` int UNSIGNED NOT NULL`);
    }

}
