import { MigrationInterface, QueryRunner } from 'typeorm';

export class statusCreator1670087253423 implements MigrationInterface {
    name = 'statusCreator1670087253423';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "todos"
            ADD "status" character varying(10) NOT NULL
        `);
      await queryRunner.query(`
            ALTER TABLE "todos"
            ADD "creator_id" integer NOT NULL
        `);
      await queryRunner.query(`
            ALTER TABLE "todos"
            ADD CONSTRAINT "FK_6d40151fb5eca05956de0a0a43a" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "todos" DROP CONSTRAINT "FK_6d40151fb5eca05956de0a0a43a"
        `);
      await queryRunner.query(`
            ALTER TABLE "todos" DROP COLUMN "creator_id"
        `);
      await queryRunner.query(`
            ALTER TABLE "todos" DROP COLUMN "status"
        `);
    }

}
