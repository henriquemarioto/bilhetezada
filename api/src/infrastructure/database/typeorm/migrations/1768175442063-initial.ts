import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1768175442063 implements MigrationInterface {
    name = 'Initial1768175442063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`payment\` (\`id\` varchar(36) NOT NULL, \`method\` enum ('pix') NOT NULL, \`amount\` int UNSIGNED NOT NULL, \`status\` enum ('pending', 'approved', 'failed', 'cancelled') NOT NULL DEFAULT 'pending', \`transaction_reference\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`gateway\` enum ('woovi', 'pagseguro', 'stripe', 'abacatepay') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` varchar(255) NOT NULL, UNIQUE INDEX \`REL_f5221735ace059250daac9d980\` (\`order_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`buyer\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`phone\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` varchar(255) NOT NULL, UNIQUE INDEX \`REL_580a8cf29915aba5401fecdb4b\` (\`order_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`batch\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`amount\` int UNSIGNED NOT NULL, \`ticket_quantity\` int UNSIGNED NOT NULL, \`start_time\` datetime NOT NULL, \`end_time\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`event_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ticket\` (\`id\` varchar(36) NOT NULL, \`used\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_item_id\` varchar(255) NOT NULL, \`batch_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_item\` (\`id\` varchar(36) NOT NULL, \`total_amount\` int NOT NULL, \`ticket_quantity\` tinyint UNSIGNED NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` varchar(255) NOT NULL, \`batch_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` varchar(36) NOT NULL, \`total_amount\` int NOT NULL, \`platform_fee_amount\` int NOT NULL, \`gateway_fee_amount\` int NOT NULL, \`event_organizer_amount_net\` int NOT NULL, \`ticket_quantity\` tinyint UNSIGNED NOT NULL, \`transaction_reference\` varchar(255) NOT NULL, \`status\` enum ('pending', 'confirmed', 'failed', 'refund') NOT NULL DEFAULT 'pending', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`event_id\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_2d33c261d42daeedbe99d57568\` (\`transaction_reference\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`event\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`state\` varchar(2) NOT NULL, \`latitude\` float NOT NULL, \`longitude\` float NOT NULL, \`place_name\` varchar(255) NULL, \`slug\` varchar(255) NOT NULL, \`start_time\` datetime NOT NULL, \`end_time\` datetime NOT NULL, \`entrance_limit_time\` datetime NULL, \`time_zone\` varchar(255) NOT NULL DEFAULT 'America/Sao_Paulo', \`capacity\` mediumint UNSIGNED NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`organizer_user_id\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_9d0d870657c4fac264cdca048e\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`withdraw\` (\`id\` varchar(36) NOT NULL, \`pix_key\` varchar(255) NOT NULL, \`amount\` int UNSIGNED NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`document\` varchar(255) NULL, \`birth_date\` datetime NULL, \`email\` varchar(255) NOT NULL, \`pix_key\` varchar(255) NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`password\` varchar(255) NULL, \`picture_url\` varchar(255) NULL, \`auth_provider\` enum ('local', 'google') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_71fdad8489d3d818ec393e6eb1\` (\`document\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`IDX_c532291a1c62b6583059ebeda1\` (\`pix_key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`logout\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_bd44cadf9f1343760c271ddacb\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_f5221735ace059250daac9d9803\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`buyer\` ADD CONSTRAINT \`FK_580a8cf29915aba5401fecdb4b1\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`batch\` ADD CONSTRAINT \`FK_f4d88f0dbe905edc5fae76859e3\` FOREIGN KEY (\`event_id\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_0dcd9e997adb5d097c0a2845905\` FOREIGN KEY (\`order_item_id\`) REFERENCES \`order_item\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_0649ee23fc72e7de3643d577481\` FOREIGN KEY (\`batch_id\`) REFERENCES \`batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_e9674a6053adbaa1057848cddfa\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_10d65a7208c7c4b53332a3bc25e\` FOREIGN KEY (\`batch_id\`) REFERENCES \`batch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_394b0d7613180ebee9028e9aaa1\` FOREIGN KEY (\`event_id\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_b9d2587d09e9c1a16cea73352e5\` FOREIGN KEY (\`organizer_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`withdraw\` ADD CONSTRAINT \`FK_05d6371b1cb3202d1ae180f16b6\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`withdraw\` DROP FOREIGN KEY \`FK_05d6371b1cb3202d1ae180f16b6\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_b9d2587d09e9c1a16cea73352e5\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_394b0d7613180ebee9028e9aaa1\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_10d65a7208c7c4b53332a3bc25e\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_e9674a6053adbaa1057848cddfa\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_0649ee23fc72e7de3643d577481\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_0dcd9e997adb5d097c0a2845905\``);
        await queryRunner.query(`ALTER TABLE \`batch\` DROP FOREIGN KEY \`FK_f4d88f0dbe905edc5fae76859e3\``);
        await queryRunner.query(`ALTER TABLE \`buyer\` DROP FOREIGN KEY \`FK_580a8cf29915aba5401fecdb4b1\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_f5221735ace059250daac9d9803\``);
        await queryRunner.query(`DROP INDEX \`IDX_bd44cadf9f1343760c271ddacb\` ON \`logout\``);
        await queryRunner.query(`DROP TABLE \`logout\``);
        await queryRunner.query(`DROP INDEX \`IDX_c532291a1c62b6583059ebeda1\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_71fdad8489d3d818ec393e6eb1\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`withdraw\``);
        await queryRunner.query(`DROP INDEX \`IDX_9d0d870657c4fac264cdca048e\` ON \`event\``);
        await queryRunner.query(`DROP TABLE \`event\``);
        await queryRunner.query(`DROP INDEX \`IDX_2d33c261d42daeedbe99d57568\` ON \`order\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`order_item\``);
        await queryRunner.query(`DROP TABLE \`ticket\``);
        await queryRunner.query(`DROP TABLE \`batch\``);
        await queryRunner.query(`DROP INDEX \`REL_580a8cf29915aba5401fecdb4b\` ON \`buyer\``);
        await queryRunner.query(`DROP TABLE \`buyer\``);
        await queryRunner.query(`DROP INDEX \`REL_f5221735ace059250daac9d980\` ON \`payment\``);
        await queryRunner.query(`DROP TABLE \`payment\``);
    }

}
