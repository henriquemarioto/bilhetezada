import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1733856926284 implements MigrationInterface {
  name = 'Initial1733856926284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customer\` DROP COLUMN \`picture\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`address\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`time_zone\` varchar(255) NOT NULL DEFAULT 'America/Sao_Paulo'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`active\` tinyint NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD \`picture_url\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD \`auth_provider\` varchar(255) NOT NULL DEFAULT 'local'`,
    );
    await queryRunner.query(`ALTER TABLE \`event\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` CHANGE \`created_at\` \`created_at\` varchar(255) NOT NULL DEFAULT '2024-12-10T18:55:28.766Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` CHANGE \`updated_at\` \`updated_at\` varchar(255) NOT NULL DEFAULT '2024-12-10T18:55:28.766Z'`,
    );
    await queryRunner.query(`ALTER TABLE \`customer\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`customer\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` CHANGE \`created_at\` \`created_at\` varchar(255) NOT NULL DEFAULT '2024-12-10T18:55:28.767Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` CHANGE \`updated_at\` \`updated_at\` varchar(255) NOT NULL DEFAULT '2024-12-10T18:55:28.767Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD CONSTRAINT \`FK_77eb0b14fb4d97093121b89fc04\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_77eb0b14fb4d97093121b89fc04\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` CHANGE \`updated_at\` \`updated_at\` varchar(255) NOT NULL DEFAULT '2024-12-09T20:14:42.382Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` CHANGE \`created_at\` \`created_at\` varchar(255) NOT NULL DEFAULT '2024-12-09T20:14:42.382Z'`,
    );
    await queryRunner.query(`ALTER TABLE \`customer\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD \`id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD PRIMARY KEY (\`id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` CHANGE \`updated_at\` \`updated_at\` varchar(255) NOT NULL DEFAULT '2024-12-09T20:14:42.381Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` CHANGE \`created_at\` \`created_at\` varchar(255) NOT NULL DEFAULT '2024-12-09T20:14:42.381Z'`,
    );
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`event\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`customer\` DROP COLUMN \`auth_provider\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` DROP COLUMN \`picture_url\``,
    );
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`active\``);
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`time_zone\``);
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`address\``);
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD \`picture\` varchar(255) NOT NULL`,
    );
  }
}
