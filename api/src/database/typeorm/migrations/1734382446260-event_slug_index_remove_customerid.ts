import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventSlugIndexRemoveCustomerid1734382446260
  implements MigrationInterface
{
  name = 'EventSlugIndexRemoveCustomerid1734382446260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`FK_77eb0b14fb4d97093121b89fc04\` ON \`event\``,
    );
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
    await queryRunner.query(
      `CREATE INDEX \`FK_77eb0b14fb4d97093121b89fc04\` ON \`event\` (\`customerId\`)`,
    );
  }
}
