import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733956352610 implements MigrationInterface {
  name = 'Migration1733956352610';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`created_at\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` CHANGE \`picture_url\` \`picture_url\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD \`updated_at\` varchar(255) NOT NULL DEFAULT '2024-12-10T18:55:28.767Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD \`created_at\` varchar(255) NOT NULL DEFAULT '2024-12-10T18:55:28.767Z'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` CHANGE \`picture_url\` \`picture_url\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`updated_at\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`updated_at\` varchar(255) NOT NULL DEFAULT '2024-12-10T18:55:28.766Z'`,
    );
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`created_at\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`created_at\` varchar(255) NOT NULL DEFAULT '2024-12-10T18:55:28.766Z'`,
    );
  }
}
