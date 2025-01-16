import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventLimitTimeForTicketPurchase1736963773859
  implements MigrationInterface
{
  name = 'AddEventLimitTimeForTicketPurchase1736963773859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`limit_time_for_ticket_purchase\` datetime NOT NULL DEFAULT '1970-01-01 00:00:00'`,
    );
    await queryRunner.query(
      `UPDATE \`event\` SET \`limit_time_for_ticket_purchase\` = \`start_time\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ALTER \`limit_time_for_ticket_purchase\` DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP COLUMN \`limit_time_for_ticket_purchase\``,
    );
  }
}
