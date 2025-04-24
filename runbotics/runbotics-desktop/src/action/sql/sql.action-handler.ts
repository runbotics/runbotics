import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';
import { Injectable } from '@nestjs/common';
import { DesktopRunResponse, StatefulActionHandler } from '@runbotics/runbotics-sdk';
import { SqlAction } from 'runbotics-common';
import { DataSource } from 'typeorm';
import { SQLActionRequest, SqlCredentials, SqlQueryActionOutput } from './sql.types';
@Injectable()
export class SqlActionHandler extends StatefulActionHandler {
    private dataSource: DataSource | null = null;

    async run(request: SQLActionRequest): Promise<DesktopRunResponse | void> {
        switch (request.script) {
            case SqlAction.CONNECT:
                await this.closeSession();
                await this.openSession(credentialAttributesMapper<SqlCredentials>(request.credentials).url);
                break;
            case SqlAction.CLOSE:
                return await this.closeSession();
            case SqlAction.QUERY:
                return await this.query(request.input.query, request.input.queryParams ?? []);
            default:
                throw new Error('Action not found');
        }
    }

    async tearDown(): Promise<void> {
        if (this.dataSource) {
            await this.closeSession();
        }
    }

    private async query(sql: string, parameters: string[]): Promise<SqlQueryActionOutput> {
        if (!this.dataSource) {
            throw new Error('DB is not connected');
        }

        const res = await this.dataSource.createEntityManager().query(sql, parameters) ?? [];
        return {
            rows: res,
            rowCount: res.length,
        };
    }

    private async openSession(url: string) {
        const sqlitePrefix = 'sqlite://';
        const postgresPrefix = 'postgres://';


        if (url.startsWith(postgresPrefix)) {
            this.dataSource = new DataSource({
                type: 'postgres',
                url: url
            });
            await this.dataSource.initialize();
        } else if (url.startsWith(sqlitePrefix)) {
            const dbPath = url.slice(sqlitePrefix.length);
            this.dataSource = new DataSource({
                type: 'sqlite',
                database: dbPath,
            });
            await this.dataSource.initialize();
        } else {
            throw new Error('Unsupported database URL');
        }
    }

    private async closeSession() {
        if (this.dataSource) {
            await this.dataSource.destroy();
            this.dataSource = null;
        }
    }

}