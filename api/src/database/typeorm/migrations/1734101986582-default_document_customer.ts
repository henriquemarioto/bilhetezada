import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultDocumentCustomer1734101986582
  implements MigrationInterface
{
  name = 'DefaultDocumentCustomer1734101986582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer\` CHANGE \`document\` \`document\` varchar(255) NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer\` CHANGE \`document\` \`document\` varchar(255) NOT NULL`,
    );
  }
}
