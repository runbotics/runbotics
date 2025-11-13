import { DataSource } from 'typeorm';
import { getMigrations } from './database/database.utils';

export default new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'runbotics',
  password: 'runbotics',
  database: 'runbotics',
  schema:'runbotics_nest_test',
  logger: 'advanced-console',
  logNotifications: true,
  logging: true,
  entities: ['dist/**/*.entity.js'],
  migrations: getMigrations(),
  migrationsTableName: 'migration',
});
