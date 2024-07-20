

import { DataSource, DataSourceOptions } from 'typeorm';


import * as dotenv from 'dotenv';
import * as path from 'path';
import { Carriage } from './src/entities/carriage.entity';
import { CarriagePlace } from './src/entities/carriagePlace.entity';
import { Train } from './src/entities/train.entity';
import { Station } from './src/entities/station.entity';
import { RouteSegment } from './src/entities/routeSegment.entity';


dotenv.config({ path: path.resolve(__dirname, "src", ".env") });
export const dbdatasource: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [Carriage, CarriagePlace, Train, Station, RouteSegment],
    migrationsTableName: "migration",
    migrations: ["./apps/train-service/src/migrations/**"],


};

const dataSource = new DataSource(dbdatasource)
export default dataSource