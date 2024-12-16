import { MigrationInterface, QueryRunner } from 'typeorm';

export class Logout1734370251290 implements MigrationInterface {
  name = 'Logout1734370251290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`logout\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`logout\``);
  }
}
