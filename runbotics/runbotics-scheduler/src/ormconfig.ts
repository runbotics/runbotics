import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'runbotics',
    password: 'runbotics',
    database: 'runbotics',
    logger: 'advanced-console',
    logNotifications: true,
    logging: true,
    entities: ['dist/src/**/*.entity.js'],
    migrations: ['dist/src/migrations/*.js'],
    migrationsTableName: 'rb_migrations.migration',
});
