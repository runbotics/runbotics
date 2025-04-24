import { credentialAttributesMapper } from '#utils/credentialAttributesMapper';
import { Injectable } from '@nestjs/common';
import { DesktopRunResponse, StatefulActionHandler } from '@runbotics/runbotics-sdk';
import Sqlite, { Database as SqliteDatabase } from 'better-sqlite3';
import { Client as PostgresClient } from 'pg';
import { SqlAction } from 'runbotics-common';
import { SQLActionRequest, SqlCredentials, SqlQueryActionOutput } from './sql.types';

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
        switch (request.script) {
            case SqlAction.CONNECT:
                await this.closeSession();
                await this.openSession(credentialAttributesMapper<SqlCredentials>(request.credentials).url);
                break;
            case SqlAction.CLOSE:
                return await this.closeSession();
            case SqlAction.QUERY:
                await this.checkSession();
                return await this.query(request.input.query, request.input.queryParams ?? []);
            default:
                throw new Error('Action not found');
        }
    }

    async tearDown(): Promise<void> {
        if (this.dbDriver) {
            await this.closeSession();
        }
    }

    private async checkSession() {
        if (!this.dbDriver) {
            throw new Error('DB is not connected');
        }
    }

    private async query(sql: string, parameters: string[]): Promise<SqlQueryActionOutput> {
        if (!this.dbDriver) throw new Error('DB not connected');

        if (this.dbDriver.type === DBDriverType.POSTGRES) {
            const rawResult = await this.dbDriver.client.query(sql, parameters);
            const rows = rawResult.rows;
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
                columns: rawResult.fields.map(x => x.name)
            };
        } else if (this.dbDriver.type === DBDriverType.SQLITE) {
            const rawResult = this.dbDriver.db.prepare(sql);
            const columns = rawResult.columns();

            const rows = rawResult.all(parameters);

            const res = [];
            for (const row of rows) {
                const obj = {};
                for (const k in (row as any)) {
                    obj[castColumnNameToPropertyName(k)] = row[k];
                }
                res.push(obj);
            }

            return {
                rowCount: rows.length,
                rows: res,
                columns: columns.map(x => x.name)
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