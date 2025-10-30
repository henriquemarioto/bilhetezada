import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerEventsRelation1734382138441 implements MigrationInterface {
  name = 'CustomerEventsRelation1734382138441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_77eb0b14fb4d97093121b89fc04\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`customer_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD CONSTRAINT \`FK_749c21609b0a354043ed0577dc5\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_749c21609b0a354043ed0577dc5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP COLUMN \`customer_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD CONSTRAINT \`FK_77eb0b14fb4d97093121b89fc04\` FOREIGN KEY (\`customerId\`) REFERENCES \`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
