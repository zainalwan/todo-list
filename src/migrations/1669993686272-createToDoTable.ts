import { MigrationInterface, QueryRunner } from 'typeorm';

export class createToDoTable1669993686272 implements MigrationInterface {
    name = 'createToDoTable1669993686272';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            CREATE TABLE "todos" (
                "id" SERIAL NOT NULL,
                "name" character varying(50) NOT NULL,
                "description" character varying(200) NOT NULL DEFAULT '',
                "due_date" TIMESTAMP WITH TIME ZONE NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "assignee_id" integer NOT NULL,
                CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id")
            )
        `);
      await queryRunner.query(`
            ALTER TABLE "todos"
            ADD CONSTRAINT "FK_6d7c3fd77573b5ecd5e1e83704d" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "todos" DROP CONSTRAINT "FK_6d7c3fd77573b5ecd5e1e83704d"
        `);
      await queryRunner.query(`
            DROP TABLE "todos"
        `);
    }

}
