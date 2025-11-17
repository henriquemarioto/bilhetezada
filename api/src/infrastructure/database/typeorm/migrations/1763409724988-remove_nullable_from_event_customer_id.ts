import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNullableFromEventCustomerId1763409724988
  implements MigrationInterface
{
  name = 'RemoveNullableFromEventCustomerId1763409724988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_749c21609b0a354043ed0577dc5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` CHANGE \`customer_id\` \`customer_id\` varchar(255) NOT NULL`,
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
      `ALTER TABLE \`event\` CHANGE \`customer_id\` \`customer_id\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event\` ADD CONSTRAINT \`FK_749c21609b0a354043ed0577dc5\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
