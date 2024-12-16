import { MigrationInterface, QueryRunner } from "typeorm";

export class LogoutUnique1734371934611 implements MigrationInterface {
    name = 'LogoutUnique1734371934611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`logout\` ADD UNIQUE INDEX \`IDX_bd44cadf9f1343760c271ddacb\` (\`token\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`logout\` DROP INDEX \`IDX_bd44cadf9f1343760c271ddacb\``);
    }

}
