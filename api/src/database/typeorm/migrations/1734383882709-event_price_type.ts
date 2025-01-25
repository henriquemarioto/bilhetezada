import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventPriceType1734383882709 implements MigrationInterface {
  name = 'EventPriceType1734383882709';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`price\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`price\` decimal(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`price\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`price\` varchar(255) NOT NULL`,
    );
  }
}
