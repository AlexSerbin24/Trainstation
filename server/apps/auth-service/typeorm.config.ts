

import { DataSource, DataSourceOptions } from 'typeorm';
import { Role } from './src/entities/role.entity';
import { Token } from './src/entities/token.entity';
import { User } from './src/entities/user.entity';

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, "src", ".env") });
export const dbdatasource: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [User, Role, Token],
    migrationsTableName: "migration",
    migrations: ["./apps/auth-service/src/migrations/**"],


};

const dataSource = new DataSource(dbdatasource)
export default dataSource