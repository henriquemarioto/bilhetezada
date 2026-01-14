import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeBatchToTicketBatch1768363432763 implements MigrationInterface {
    name = 'ChangeBatchToTicketBatch1768363432763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_0649ee23fc72e7de3643d577481\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_10d65a7208c7c4b53332a3bc25e\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` CHANGE \`batch_id\` \`ticket_batch_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`batch_id\` \`ticket_batch_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE TABLE \`ticket_batch\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`amount\` int UNSIGNED NOT NULL, \`ticket_quantity\` int UNSIGNED NOT NULL, \`tickets_sold\` int UNSIGNED NOT NULL DEFAULT '0', \`start_at\` datetime NOT NULL, \`end_at\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`event_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_beacc71a97f24020af3450d0ee2\` FOREIGN KEY (\`ticket_batch_id\`) REFERENCES \`ticket_batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` ADD CONSTRAINT \`FK_d28eab9d1ff8f66e4781cfd74b1\` FOREIGN KEY (\`event_id\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_fa6833f7e6ddcf80bf7b4281b81\` FOREIGN KEY (\`ticket_batch_id\`) REFERENCES \`ticket_batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_fa6833f7e6ddcf80bf7b4281b81\``);
        await queryRunner.query(`ALTER TABLE \`ticket_batch\` DROP FOREIGN KEY \`FK_d28eab9d1ff8f66e4781cfd74b1\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_beacc71a97f24020af3450d0ee2\``);
        await queryRunner.query(`DROP TABLE \`ticket_batch\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` CHANGE \`ticket_batch_id\` \`batch_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ticket\` CHANGE \`ticket_batch_id\` \`batch_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_10d65a7208c7c4b53332a3bc25e\` FOREIGN KEY (\`batch_id\`) REFERENCES \`batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_0649ee23fc72e7de3643d577481\` FOREIGN KEY (\`batch_id\`) REFERENCES \`batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
