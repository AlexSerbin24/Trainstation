import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entities/user.entity";
import { Role } from "../entities/role.entity";
import * as path from "path";
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

export class Initial1721237180348 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        dotenv.config({ path: path.resolve(__dirname, ".env") });


        const adminRole = (await queryRunner.manager.save(
            queryRunner.manager.create(Role, [
                {
                    name: "Admin"
                },
                {
                    name: "User"
                }])
        )).find(role => role.name === "Admin");

        if (!adminRole) {
            throw new Error("Role 'Admin' not found after creation.");
        }


        const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        await queryRunner.manager.save(
            queryRunner.manager.create(User, {
                roleId: adminRole.id,
                name: process.env.ADMIN_NAME,
                lastname: process.env.ADMIN_LAST_NAME,
                patronymic: process.env.ADMIN_PATRONYMIC,
                email: process.env.ADMIN_EMAIL,
                passwordHash: password
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user"`);
        await queryRunner.query(`DELETE FROM "role"`);
    }

}




