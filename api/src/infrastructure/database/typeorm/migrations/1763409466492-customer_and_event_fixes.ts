import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerAndEventFixes1763409466492 implements MigrationInterface {
  name = 'CustomerAndEventFixes1763409466492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_3f8b6d1eac529047d7e4c3f05a\` ON \`customer\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_91a2f3c7e8d654b1ac47d9205f\` ON \`customer\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD UNIQUE INDEX \`IDX_cd6c4fbf1a8c274d31f072fa21\` (\`document\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` ADD UNIQUE INDEX \`IDX_fdb2f3ad8115da4c7718109a6e\` (\`email\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_749c21609b0a354043ed0577dc5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` CHANGE \`entrance_limit_time\` \`entrance_limit_time\` datetime NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP COLUMN \`customer_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD \`customer_id\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `UPDATE \`event\` SET \`customer_id\` = '0' WHERE \`customer_id\` IS NULL`,
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
      `ALTER TABLE \`event\` ADD \`customer_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` CHANGE \`entrance_limit_time\` \`entrance_limit_time\` datetime NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD CONSTRAINT \`FK_749c21609b0a354043ed0577dc5\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` DROP INDEX \`IDX_fdb2f3ad8115da4c7718109a6e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer\` DROP INDEX \`IDX_cd6c4fbf1a8c274d31f072fa21\``,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_91a2f3c7e8d654b1ac47d9205f\` ON \`customer\` (\`document\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_3f8b6d1eac529047d7e4c3f05a\` ON \`customer\` (\`email\`)`,
    );
  }
}
