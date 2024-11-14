import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { GoogleAction } from 'runbotics-common';
import z from 'zod';
import { getCellsInputSchema,
    getWorksheetInputSchema,
    getCellsByValueInputSchema,
    getCellInputSchema,
    setCellsInputSchema,
} from './google.utils';

export type GoogleActionRequest =
    | DesktopRunRequest<GoogleAction.SHEETS_SET_CELLS, GoogleSheetWriteActionInput>
    | DesktopRunRequest<GoogleAction.SHEETS_GET_WORKSHEET, GoogleSheetGetWorksheetActionInput>
    | DesktopRunRequest<GoogleAction.SHEETS_GET_CELL, GoogleSheetGetCellActionInput>
    | DesktopRunRequest<GoogleAction.SHEETS_GET_CELLS, GoogleSheetGetCellsActionInput>
    | DesktopRunRequest<GoogleAction.SHEETS_GET_CELL_BY_VALUE, GoogleSheetGetCellsByValueActionInput>;

export type GoogleSheetGetWorksheetActionInput = z.infer<typeof getWorksheetInputSchema>;
export type GoogleSheetGetCellsActionInput = z.infer<typeof getCellsInputSchema>;
export type GoogleSheetGetCellActionInput = z.infer<typeof getCellInputSchema>;
export type GoogleSheetGetCellsByValueActionInput = z.infer<typeof getCellsByValueInputSchema>;
export type GoogleSheetWriteActionInput = z.infer<typeof setCellsInputSchema>;

export interface CellByValueActionOutput {
    column: string;
    row: string;
    cellAddress: string;
    cellValue: string;
}

export interface GoogleCredential {
    email: string;
    key: string;
}
