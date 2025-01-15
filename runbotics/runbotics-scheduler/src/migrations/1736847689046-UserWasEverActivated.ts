import { User } from '#/scheduler-database/user/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserWasEverActivated1736847689046 implements MigrationInterface {
    name = 'UserWasEverActivated1736847689046';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "jhi_user" ADD "was_ever_activated" boolean NOT NULL DEFAULT false`
        );

        const userRepository = queryRunner.manager.getRepository(User);
        const users = await userRepository.find();
        const updatedUsers = users.map((user) => ({
            ...user,
            wasEverActivated: true,
        }));

        await userRepository.save(updatedUsers);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "jhi_user" DROP COLUMN "was_ever_activated"`
        );
    }
}
