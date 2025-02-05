import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1733856926283 implements MigrationInterface {
  name = 'Initial1733856926283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`customer\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`document\` varchar(255) NOT NULL, \`birth_date\` datetime NULL, \`email\` varchar(255) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`password\` varchar(255) NULL, \`picture\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_91a2f3c7e8d654b1ac47d9205f\` (\`document\`), UNIQUE INDEX \`IDX_3f8b6d1eac529047d7e4c3f05a\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`event\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`start_time\` datetime NOT NULL, \`end_time\` datetime NOT NULL, \`entrance_limit_time\` datetime NOT NULL, \`price\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`customerId\` varchar(36) NULL, INDEX \`REL_7c92a1d6e53fbd48a7e4c9b10f\` (\`customerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`event\``);
    await queryRunner.query(`DROP TABLE \`customer\``);
  }
}
