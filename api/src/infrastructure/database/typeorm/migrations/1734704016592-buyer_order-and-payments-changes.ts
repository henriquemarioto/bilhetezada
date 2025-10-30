import { MigrationInterface, QueryRunner } from 'typeorm';

export class BuyerOrderAndPaymentsChanges1734704016592
  implements MigrationInterface
{
  name = 'BuyerOrderAndPaymentsChanges1734704016592';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`buyer\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`buyerId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD UNIQUE INDEX \`IDX_20981b2b68bf03393c44dd1b9d\` (\`buyerId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD \`value\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD \`status\` enum ('pending', 'paid', 'cancelled', 'failed') NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD \`transaction_reference\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` ADD \`description\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('pending', 'confirmed', 'failed') NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_20981b2b68bf03393c44dd1b9d\` ON \`order\` (\`buyerId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_20981b2b68bf03393c44dd1b9d7\` FOREIGN KEY (\`buyerId\`) REFERENCES \`buyer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_20981b2b68bf03393c44dd1b9d7\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_20981b2b68bf03393c44dd1b9d\` ON \`order\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` CHANGE \`status\` \`status\` enum ('pending', 'paid', 'cancelled') NOT NULL DEFAULT 'pending'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`payment\` DROP COLUMN \`transaction_reference\``,
    );
    await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`status\``);
    await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`value\``);
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP INDEX \`IDX_20981b2b68bf03393c44dd1b9d\``,
    );
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`buyerId\``);
    await queryRunner.query(`DROP TABLE \`buyer\``);
  }
}
