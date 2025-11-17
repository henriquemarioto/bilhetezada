import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventStateLength1763420689175 implements MigrationInterface {
  name = 'EventStateLength1763420689175';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`state\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`state\` varchar(2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`state\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`state\` varchar(255) NOT NULL`,
    );
  }
}
