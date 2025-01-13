import { MigrationInterface, QueryRunner } from 'typeorm';

export class Ticket1736277127219 implements MigrationInterface {
  name = 'Ticket1736277127219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_28c756d4fd41223fedfbd2750e\` ON \`order\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_8724877ec30a3aab629727b36e\` ON \`order\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`ticket\` (\`id\` varchar(36) NOT NULL, \`used\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`event_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`ticket_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD UNIQUE INDEX \`IDX_3f1b1be47e20ec8285f9ba9900\` (\`ticket_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_3f1b1be47e20ec8285f9ba9900\` ON \`order\` (\`ticket_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_3f1b1be47e20ec8285f9ba99008\` FOREIGN KEY (\`ticket_id\`) REFERENCES \`ticket\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ticket\` ADD CONSTRAINT \`FK_902a22d2110174b48925314c875\` FOREIGN KEY (\`event_id\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ticket\` DROP FOREIGN KEY \`FK_902a22d2110174b48925314c875\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_3f1b1be47e20ec8285f9ba99008\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_3f1b1be47e20ec8285f9ba9900\` ON \`order\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP INDEX \`IDX_3f1b1be47e20ec8285f9ba9900\``,
    );
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`ticket_id\``);
    await queryRunner.query(`DROP TABLE \`ticket\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_8724877ec30a3aab629727b36e\` ON \`order\` (\`buyer_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_28c756d4fd41223fedfbd2750e\` ON \`order\` (\`payment_id\`)`,
    );
  }
}
