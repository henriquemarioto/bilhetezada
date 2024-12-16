import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerAdjustment1734102615574 implements MigrationInterface {
    name = 'CustomerAdjustment1734102615574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`document\` \`document\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`birth_date\` \`birth_date\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`password\` \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customer\` DROP COLUMN \`auth_provider\``);
        await queryRunner.query(`ALTER TABLE \`customer\` ADD \`auth_provider\` enum ('local', 'google') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer\` DROP COLUMN \`auth_provider\``);
        await queryRunner.query(`ALTER TABLE \`customer\` ADD \`auth_provider\` varchar(255) NOT NULL DEFAULT 'local'`);
        await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`birth_date\` \`birth_date\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`document\` \`document\` varchar(255) NOT NULL DEFAULT ''`);
    }

}
