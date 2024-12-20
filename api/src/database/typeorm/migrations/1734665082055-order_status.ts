import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderStatus1734665082055 implements MigrationInterface {
  name = 'OrderStatus1734665082055';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`status\` enum ('pending', 'paid', 'cancelled') NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` CHANGE \`method\` \`method\` enum ('pix') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment\` CHANGE \`method\` \`method\` enum ('PIX') NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`status\``);
  }
}
