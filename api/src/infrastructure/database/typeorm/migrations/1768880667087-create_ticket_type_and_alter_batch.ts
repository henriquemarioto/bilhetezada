import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTicketTypeAndAlterBatch1768880667087 implements MigrationInterface {
    name = 'CreateTicketTypeAndAlterBatch1768880667087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_beacc71a97f24020af3450d0ee2\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_fa6833f7e6ddcf80bf7b4281b81\``);
        await queryRunner.query(`CREATE TABLE \`ticket_type\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(50) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`event_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`ticket_batch_id\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP COLUMN \`end_time\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP COLUMN \`start_time\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP COLUMN \`ticket_quantity\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP COLUMN \`ticket_batch_id\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD \`batch_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD \`ticket_type_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD \`quantity\` int UNSIGNED NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD \`sold\` int UNSIGNED NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD \`start_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD \`end_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD \`status\` enum ('SCHEDULED', 'ACTIVE', 'SOLD_OUT', 'FINISHED') NOT NULL DEFAULT 'SCHEDULED'`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD \`ticket_type_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD \`batch_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD \`ticket_type_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ticket_type\` ADD CONSTRAINT \`FK_0af363f9f7cc449c18178dfe0a2\` FOREIGN KEY (\`event_id\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_0649ee23fc72e7de3643d577481\` FOREIGN KEY (\`batch_id\`) REFERENCES \`batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_af51af23249ad05ee17dc48019a\` FOREIGN KEY (\`ticket_type_id\`) REFERENCES \`ticket_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD CONSTRAINT \`FK_c20a6e4eb144721e80cefa1ab51\` FOREIGN KEY (\`ticket_type_id\`) REFERENCES \`ticket_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_10d65a7208c7c4b53332a3bc25e\` FOREIGN KEY (\`batch_id\`) REFERENCES \`batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_9c6510c4f3e28051172c038a090\` FOREIGN KEY (\`ticket_type_id\`) REFERENCES \`ticket_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_9c6510c4f3e28051172c038a090\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_10d65a7208c7c4b53332a3bc25e\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP FOREIGN KEY \`FK_c20a6e4eb144721e80cefa1ab51\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_af51af23249ad05ee17dc48019a\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_0649ee23fc72e7de3643d577481\``);
        await queryRunner.query(`ALTER TABLE \`ticket_type\` DROP FOREIGN KEY \`FK_0af363f9f7cc449c18178dfe0a2\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP COLUMN \`ticket_type_id\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP COLUMN \`batch_id\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP COLUMN \`ticket_type_id\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP COLUMN \`end_at\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP COLUMN \`start_at\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP COLUMN \`sold\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`ticket_type_id\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`batch_id\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD \`ticket_batch_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD \`ticket_quantity\` int UNSIGNED NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD \`start_time\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD \`end_time\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD \`ticket_batch_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`ticket_type\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_fa6833f7e6ddcf80bf7b4281b81\` FOREIGN KEY (\`ticket_batch_id\`) REFERENCES \`ticket_batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_beacc71a97f24020af3450d0ee2\` FOREIGN KEY (\`ticket_batch_id\`) REFERENCES \`ticket_batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
