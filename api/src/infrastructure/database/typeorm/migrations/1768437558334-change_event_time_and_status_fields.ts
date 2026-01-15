import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEventTimeAndStatusFields1768437558334 implements MigrationInterface {
    name = 'ChangeEventTimeAndStatusFields1768437558334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`active\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`end_time\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`entrance_limit_time\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`start_time\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`start_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`end_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`entrance_limit_at\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`status\` enum ('draft', 'published', 'finished', 'canceled') NOT NULL DEFAULT 'draft'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`entrance_limit_at\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`end_at\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`start_at\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`start_time\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`entrance_limit_time\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`end_time\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`active\` tinyint NOT NULL DEFAULT '1'`);
    }

}
