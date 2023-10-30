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

export const sortNumbersDescending = (array: (number | string)[]): number[] => {
    const parsedArray = array.map(item => {
        const number = Number(item);
        if (isNaN(number)) {
            throw new Error('At least one value is not a number');
        }
        return number;
    });

    return parsedArray.sort((a: number, b: number) => b - a);    
};