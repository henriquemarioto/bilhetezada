import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentLinkTable1736169165205 implements MigrationInterface {
  name = 'PaymentLinkTable1736169165205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_20981b2b68bf03393c44dd1b9d\` ON \`order\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`payment_link\` (\`id\` varchar(36) NOT NULL, \`url\` varchar(255) NOT NULL, \`owner\` enum ('event', 'affiliate') NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`eventId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment_link\` ADD CONSTRAINT \`FK_125e1c07a7b8dd5df66c71336bd\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`payment_link\` DROP FOREIGN KEY \`FK_125e1c07a7b8dd5df66c71336bd\``,
    );
    await queryRunner.query(`DROP TABLE \`payment_link\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_20981b2b68bf03393c44dd1b9d\` ON \`order\` (\`buyerId\`)`,
    );
  }
}
