import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrderTransactionReference1736200431098
  implements MigrationInterface
{
  name = 'OrderTransactionReference1736200431098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_20981b2b68bf03393c44dd1b9d7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_9ad13532f48db4ac5a3b3dd70e5\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_20981b2b68bf03393c44dd1b9d\` ON \`order\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_9ad13532f48db4ac5a3b3dd70e\` ON \`order\``,
    );
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`buyerId\``);
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`paymentId\``);
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`transaction_reference\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`payment_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD UNIQUE INDEX \`IDX_28c756d4fd41223fedfbd2750e\` (\`payment_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`buyer_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD UNIQUE INDEX \`IDX_8724877ec30a3aab629727b36e\` (\`buyer_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_28c756d4fd41223fedfbd2750e\` ON \`order\` (\`payment_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_8724877ec30a3aab629727b36e\` ON \`order\` (\`buyer_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_28c756d4fd41223fedfbd2750e1\` FOREIGN KEY (\`payment_id\`) REFERENCES \`payment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_8724877ec30a3aab629727b36ed\` FOREIGN KEY (\`buyer_id\`) REFERENCES \`buyer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_8724877ec30a3aab629727b36ed\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_28c756d4fd41223fedfbd2750e1\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_8724877ec30a3aab629727b36e\` ON \`order\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_28c756d4fd41223fedfbd2750e\` ON \`order\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP INDEX \`IDX_8724877ec30a3aab629727b36e\``,
    );
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`buyer_id\``);
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP INDEX \`IDX_28c756d4fd41223fedfbd2750e\``,
    );
    await queryRunner.query(`ALTER TABLE \`order\` DROP COLUMN \`payment_id\``);
    await queryRunner.query(
      `ALTER TABLE \`order\` DROP COLUMN \`transaction_reference\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`paymentId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD \`buyerId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_9ad13532f48db4ac5a3b3dd70e\` ON \`order\` (\`paymentId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_20981b2b68bf03393c44dd1b9d\` ON \`order\` (\`buyerId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_9ad13532f48db4ac5a3b3dd70e5\` FOREIGN KEY (\`paymentId\`) REFERENCES \`payment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order\` ADD CONSTRAINT \`FK_20981b2b68bf03393c44dd1b9d7\` FOREIGN KEY (\`buyerId\`) REFERENCES \`buyer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
