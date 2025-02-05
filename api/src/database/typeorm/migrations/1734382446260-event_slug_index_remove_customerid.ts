import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventSlugIndexRemoveCustomerid1734382446260
  implements MigrationInterface
{
  name = 'EventSlugIndexRemoveCustomerid1734382446260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`customerId\``);
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD UNIQUE INDEX \`IDX_9d0d870657c4fac264cdca048e\` (\`slug\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP INDEX \`IDX_9d0d870657c4fac264cdca048e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`customerId\` varchar(255) NOT NULL`,
    );
  }
}
