import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { SqlAction } from 'runbotics-common';
import { z } from 'zod';
import { sqlCredentialsSchema, sqlExecActionInputSchema, sqlQueryActionInputSchema } from './sql.utils';

export enum SQLActionURLPrefix {
    SQLITE = 'sqlite://',
    POSTGRES = 'postgres://'
}

export type SQLActionRequest =
    | DesktopRunRequest<SqlAction.CONNECT>
    | DesktopRunRequest<SqlAction.QUERY, SqlQueryActionInput>
    | DesktopRunRequest<SqlAction.EXEC, SqlExecActionInput>
    | DesktopRunRequest<SqlAction.CLOSE>

export type SqlQueryActionInput = z.infer<typeof sqlQueryActionInputSchema>
export type SqlExecActionInput = z.infer<typeof sqlExecActionInputSchema>

export type SqlCredentials = z.infer<typeof sqlCredentialsSchema>

export type SqlQueryActionOutput = {
    rows: Record<string, any>[],
    columns: string[],
    rowCount: number
}