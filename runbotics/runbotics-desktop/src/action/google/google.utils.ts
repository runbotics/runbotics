import { ActionRegex } from 'runbotics-common';
import { CellByValueActionOutput } from './google.types';
import z from 'zod';

const googleSheetInputBaseSchema = z.object({
    spreadsheetId: z.string({
        required_error: 'Google spreadsheet ID is missing',
    }),
    sheet: z.string().optional(),
});

export const getWorksheetInputSchema = googleSheetInputBaseSchema;

export const getCellsInputSchema = googleSheetInputBaseSchema.and(
    z.object({
        range: z
            .string({ required_error: 'Cell range is missing' })
            .regex(new RegExp(ActionRegex.CELL_RANGE), {
                message: 'Invalid cell range format, eg. A1:Z100',
            }),
    })
);

export const getCellInputSchema = googleSheetInputBaseSchema.and(
    z.object({
        cell: z
            .string({ required_error: 'Cell address is missing' })
            .regex(new RegExp(ActionRegex.CELL_ADDRESS), {
                message: 'Invalid cell address format, eg. A123',
            }),
    })
);

export const getCellsByValueInputSchema = googleSheetInputBaseSchema.and(
    z.object({
        value: z.string({ required_error: 'Missing value to find sheet cell' }),
    })
);

export const setCellsInputSchema = googleSheetInputBaseSchema.and(
    z.object({
        values: z.array(z.array(z.string().or(z.number()))).or(z.string()).optional(),
        range: z
            .string({ required_error: 'Cell range is missing' })
            .regex(new RegExp(ActionRegex.CELL_RANGE), {
                message: 'Invalid cell range format, eg. A1:Z100',
            }),
    })
);

export const getCellCoordinatesByValue = (
    value: string,
    values: unknown[][] | undefined
) => {
    const cellsByValueOutput: CellByValueActionOutput[] = [];
    if (!values) {
        return cellsByValueOutput;
    }

    const alphabetSize = 26;
    const alphabetStartIndexUTF = 65;
    for (let row = 0; row < values.length; row++) {
        const columnsCount = values[row].length;
        for (let col = 0; col < columnsCount; col++) {
            const cellValue = values[row][col];
            if (cellValue !== value) continue;

            const columnsCharsUTF = [];
            const columnNameCharCount = Math.floor((col + 1) / alphabetSize);
            for (let char = 0; char < columnNameCharCount; char++) {
                columnsCharsUTF.push(alphabetStartIndexUTF);
            }

            const lastColumnNameCharUTF =
                alphabetStartIndexUTF + (col % alphabetSize);
            columnsCharsUTF.push(lastColumnNameCharUTF);

            const columnName = String.fromCharCode(...columnsCharsUTF);

            cellsByValueOutput.push({
                column: columnName,
                row: String(row + 1),
                cellAddress: `${columnName}${row + 1}`,
                cellValue,
            });
        }
    }

    return cellsByValueOutput;
};
