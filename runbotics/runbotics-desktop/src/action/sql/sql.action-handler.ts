import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';
import { Injectable } from '@nestjs/common';
import { DesktopRunResponse, StatefulActionHandler } from '@runbotics/runbotics-sdk';
import Sqlite, { Database as SqliteDatabase } from 'better-sqlite3';
import { Client as PostgresClient } from 'pg';
import { SqlAction } from 'runbotics-common';
import { SQLActionRequest, SqlQueryActionOutput } from './sql.types';
import { sqlCredentialsSchema, sqlExecActionInputSchema, sqlQueryActionInputSchema } from './sql.utils';

enum DBDriverType {
    POSTGRES = 'postgres',
    SQLITE = 'sqlite',
}

type DBDriver = {
    type: DBDriverType.POSTGRES,
    client: PostgresClient
} | {
    type: DBDriverType.SQLITE,
    db: SqliteDatabase
}

const castColumnNameToPropertyName = (x: string | symbol | number): string | symbol => {
    if (typeof x === 'number') {
        return x.toString();
    }
    return x;
};

@Injectable()
export class SqlActionHandler extends StatefulActionHandler {
    private dbDriver: DBDriver | null = null;

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
            return await this.query(inputParsed.query, inputParsed.queryParams);
        } else if(request.script === SqlAction.EXEC) {
            const inputParsed = sqlExecActionInputSchema.parse(request.input);
            return await this.exec(inputParsed.query);
        } else {
            throw new Error('Action not found');
        }
    }

    async tearDown(): Promise<void> {
        if (this.dbDriver) {
            await this.closeSession();
        }
    }

    private async exec(sql: string): Promise<void> {
        if (!this.dbDriver) throw new Error('DB not connected');

        if (this.dbDriver.type === DBDriverType.POSTGRES) {
            await this.dbDriver.client.query(sql);
        } else if (this.dbDriver.type === DBDriverType.SQLITE) {
            this.dbDriver.db.exec(sql);
        } else {
            throw new Error('Unsupported database driver');
        }
    }

    private async query(sql: string, parameters: (string | number | null)[]): Promise<SqlQueryActionOutput> {
        if (!this.dbDriver) throw new Error('DB not connected');

        if (this.dbDriver.type === DBDriverType.POSTGRES) {
            const rawResult = await this.dbDriver.client.query(sql, parameters);
            const rows = rawResult.rows ?? [];
            const res = [];
            for (const row of rows) {
                const obj = {};
                for (const k in row) {
                    obj[castColumnNameToPropertyName(k)] = row[k];
                }
                res.push(obj);
            }

            return {
                rowCount: res.length,
                rows: res,
                columns: !rawResult.fields || !rawResult.fields.length ? [] : rawResult.fields.map(x => x.name) ?? []
            };
        } else if (this.dbDriver.type === DBDriverType.SQLITE) {
            const rawResult = this.dbDriver.db.prepare(sql);

            let rows: any[] = [];
            if (rawResult.reader) {
                rows = rawResult.all(parameters);
            } else {
                rawResult.run(parameters);
            }

            const res = [];
            for (const row of rows) {
                const obj = {};
                for (const k in (row as any)) {
                    obj[castColumnNameToPropertyName(k)] = row[k];
                }
                res.push(obj);
            }

            let columns: string[] = [];
            try {
                columns = rawResult.columns().map(x => x.name);
            } catch (e) {
                // This path fails, when query is one, which does not return data (think of ALTER TABLE)
                // ignore this error and return no columns instead
                // Note that we can't extract columns from results, as there may be no results, and thus no columns.
            }

            return {
                rowCount: rows.length,
                rows: res,
                columns: columns
            };
        } else {
            throw new Error('Unsupported database driver');
        }
    }

    private async openSession(url: string) {
        const sqlitePrefix = 'sqlite://';
        const postgresPrefix = 'postgres://';

        if (url.startsWith(postgresPrefix)) {
            const client = new PostgresClient(url);
            await client.connect();

            this.dbDriver = {
                type: DBDriverType.POSTGRES,
                client,
            };
        } else if (url.startsWith(sqlitePrefix)) {
            const dbPath = url.slice(sqlitePrefix.length);
            const db = new Sqlite(dbPath);

            this.dbDriver = {
                type: DBDriverType.SQLITE,
                db,
            };
        } else {
            throw new Error('Unsupported database URL');
        }
    }

    private async closeSession() {
        if (this.dbDriver) {

            switch (this.dbDriver.type) {
                case DBDriverType.POSTGRES:
                    await this.dbDriver.client.end();
                    break;
                case DBDriverType.SQLITE:
                    this.dbDriver.db.close();
                    break;
                default:
                    throw new Error('Unknown database driver type');
            }
        }

        this.dbDriver = null;
    }

}