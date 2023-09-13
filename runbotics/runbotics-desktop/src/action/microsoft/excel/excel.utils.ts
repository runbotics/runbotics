import { ExcelSession } from './excel.types';

export const hasWorkbookSessionId = (
    value: unknown
): value is Required<Pick<ExcelSession, 'workbookSessionId'>> => typeof value === 'object'
    && value !== undefined && value !== null
    && 'workbookSessionId' in value
    && typeof value.workbookSessionId === 'string';

export const hasWorksheetName = (
    value: unknown
): value is Pick<ExcelSession, 'worksheetName'> => typeof value === 'object'
    && value !== undefined && value !== null
    && 'worksheetName' in value
    && typeof value.worksheetName === 'string';
