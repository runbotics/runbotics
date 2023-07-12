import { DesktopRunRequest } from 'runbotics-sdk';

export type SAPActionRequest =
| DesktopRunRequest<'excel.setCellValue', ExcelSetCellValueActionInput>

// --- action
export type ExcelSetCellValueActionInput = {
    path: string;
    row: number;
    column: number | string;
    value: string | number;
};
export type ExcelSetCellValueActionOutput = any;