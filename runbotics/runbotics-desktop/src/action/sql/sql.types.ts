import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { SqlAction } from 'runbotics-common';

export type SQLActionRequest =
    | DesktopRunRequest<SqlAction.CONNECT>
    | DesktopRunRequest<SqlAction.QUERY, SqlQueryActionInput>
    | DesktopRunRequest<SqlAction.CLOSE>
    
export type SqlQueryActionInput = {
    query: string,
    queryParams: string[]
}

export type SqlCredentials = {
    url: string
}

export type SqlQueryActionOutput = {
    rows: Record<string, any>[],
    columns: string[],
    rowCount: number
}