import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';
import { Injectable } from '@nestjs/common';
import { DesktopRunResponse, StatefulActionHandler } from '@runbotics/runbotics-sdk';
import { SqlAction } from 'runbotics-common';
import { DataSource } from 'typeorm';
import { SQLActionRequest, SQLActionURLPrefix, SqlQueryActionOutput } from './sql.types';
import { sqlCredentialsSchema, sqlQueryActionInputSchema } from './sql.utils';

@Injectable()
export class SqlActionHandler extends StatefulActionHandler {
    private dataSource: DataSource | null = null;

    async run(request: SQLActionRequest): Promise<DesktopRunResponse | void> {
        if (request.script === SqlAction.CONNECT) {
            await this.closeSession();
            const credentials = credentialAttributesMapper(request.credentials);
            const parsedCredentials = sqlCredentialsSchema.parse(credentials);
            await this.openSession(parsedCredentials.url);
        } else if (request.script === SqlAction.CLOSE) {
            return await this.closeSession();
        } else if (request.script === SqlAction.QUERY) {
            const inputParsed = sqlQueryActionInputSchema.parse(request.input);
            return await this.query(inputParsed.query, inputParsed.queryParams ?? []);
        } else {
            throw new Error('Action not found');
        }
    }

    async tearDown(): Promise<void> {
        if (this.dataSource) {
            await this.closeSession();
        }
    }

    private async query(sql: string, parameters: (string | number | null)[]): Promise<SqlQueryActionOutput> {
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
        if (url.startsWith(SQLActionURLPrefix.POSTGRES)) {
            this.dataSource = new DataSource({
                type: 'postgres',
                url: url
            });
            await this.dataSource.initialize();
        } else if (url.startsWith(SQLActionURLPrefix.SQLITE)) {
            const dbPath = url.slice(SQLActionURLPrefix.SQLITE.length);
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