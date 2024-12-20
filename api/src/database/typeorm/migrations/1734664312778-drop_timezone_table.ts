import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTimezoneTable1734664312778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_416ff1a8aedc587a4b907606f1\` ON \`timezone\``,
    );
    await queryRunner.query(`DROP TABLE \`timezone\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`timezone\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, UNIQUE INDEX \`IDX_416ff1a8aedc587a4b907606f1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `INSERT INTO timezone (id, name, description) VALUES
          (UUID(), 'America/Sao_Paulo', 'Horário de Brasília (GMT-3)'),
          (UUID(), 'America/Manaus', 'Horário do Amazonas (GMT-4)'),
          (UUID(), 'America/Cuiaba', 'Horário do Mato Grosso (GMT-4)'),
          (UUID(), 'America/Porto_Velho', 'Horário de Rondônia (GMT-4)'),
          (UUID(), 'America/Boa_Vista', 'Horário de Boa Vista (GMT-4)'),
          (UUID(), 'America/Rio_Branco', 'Horário do Acre (GMT-5)');`,
    );
  }
}
