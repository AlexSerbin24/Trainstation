

import { DataSource, DataSourceOptions } from 'typeorm';


import * as dotenv from 'dotenv';
import * as path from 'path';
import { ExtraService } from './src/entities/extra-service.entity';
import { Ticket } from './src/entities/ticket.entity';

dotenv.config({ path: path.resolve(__dirname, "src", ".env") });
export const dbdatasource: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [Ticket, ExtraService],
    migrationsTableName: "migration",
    migrations: ["./apps/ticket-service/src/migrations/**"],


};

const dataSource = new DataSource(dbdatasource)
export default dataSource