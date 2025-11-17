import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventCapacityAndLocationInformation1763411509100
  implements MigrationInterface
{
  name = 'EventCapacityAndLocationInformation1763411509100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`city\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`state\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`latitude\` float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`longitude\` float NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`place_name\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`capacity\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`capacity\``);
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`place_name\``);
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`longitude\``);
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`latitude\``);
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`state\``);
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`city\``);
  }
}
