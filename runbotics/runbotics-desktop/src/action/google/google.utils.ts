import { ActionRegex } from 'runbotics-common';
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
        values: z.array(z.array(z.string().or(z.number()))).optional(),
        range: z
            .string({ required_error: 'Cell range is missing' })
            .regex(new RegExp(ActionRegex.CELL_RANGE), {
                message: 'Invalid cell range format, eg. A1:Z100',
            }),
    })
);
