import { DataSource } from 'typeorm';
import * as settings from './settings';
import { migrations } from './migrations';
import { entities } from './entities';

export const dataSource: DataSource = new DataSource({
  type: 'postgres',
  host: settings.POSTGRES_HOST,
  port: settings.POSTGRES_PORT,
  username: settings.POSTGRES_USER,
  password: settings.POSTGRES_PASSWORD,
  database: settings.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: entities,
  migrations: migrations,
});
