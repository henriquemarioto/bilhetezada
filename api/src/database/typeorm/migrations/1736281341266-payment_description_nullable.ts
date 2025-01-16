import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentDescriptionNullable1736281341266
  implements MigrationInterface
{
  name = 'PaymentDescriptionNullable1736281341266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_3f1b1be47e20ec8285f9ba9900\` ON \`order\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` CHANGE \`description\` \`description\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_3f1b1be47e20ec8285f9ba9900\` ON \`order\` (\`ticket_id\`)`,
    );
  }
}
