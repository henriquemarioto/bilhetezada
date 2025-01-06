import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentLinkJoinColumn1736182904636 implements MigrationInterface {
  name = 'PaymentLinkJoinColumn1736182904636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment_link\` DROP FOREIGN KEY \`FK_125e1c07a7b8dd5df66c71336bd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_link\` CHANGE \`eventId\` \`event_id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_link\` ADD CONSTRAINT \`FK_af0541d0d407a6bf7b38976af3b\` FOREIGN KEY (\`event_id\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment_link\` DROP FOREIGN KEY \`FK_af0541d0d407a6bf7b38976af3b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_link\` CHANGE \`event_id\` \`eventId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_link\` ADD CONSTRAINT \`FK_125e1c07a7b8dd5df66c71336bd\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
