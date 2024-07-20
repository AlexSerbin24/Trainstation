

import { DataSource, DataSourceOptions } from 'typeorm';


import * as dotenv from 'dotenv';
import * as path from 'path';
import { Task } from './src/entities/task.entity';

dotenv.config({ path: path.resolve(__dirname, "src", ".env") });
export const dbdatasource: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [Task],
    migrationsTableName: "migration",
    migrations: ["./apps/notification-service/src/migrations/**"],


};

const dataSource = new DataSource(dbdatasource)
export default dataSource