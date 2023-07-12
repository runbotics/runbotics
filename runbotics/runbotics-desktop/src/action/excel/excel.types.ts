import { DesktopRunRequest } from 'runbotics-sdk';

export type SAPActionRequest =
| DesktopRunRequest<'excel.setCellValue', ExcelSetCellValueActionInput>

// --- action
export type ExcelSetCellValueActionInput = {
    path: string;
    row: number;
    column: string | number;
    value: string | number;
};

export type ExcelSetCellValueActionOutput = Record<string, never>;