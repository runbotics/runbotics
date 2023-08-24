import { DesktopRunRequest } from 'runbotics-sdk';

export enum RegexPatterns {
    EXCEL_WORKSHEET_NAME = '^[^\\[\\]\\*\\?\\/\\\\\\:\\|]*$',
}

export type ExcelActionRequest =
    | DesktopRunRequest<'excel.open', ExcelOpenActionInput>
    | DesktopRunRequest<'excel.getCell', ExcelGetCellActionInput>
    | DesktopRunRequest<'excel.getCells', ExcelGetCellsActionInput>
    | DesktopRunRequest<'excel.close'>
    | DesktopRunRequest<'excel.save'>
    | DesktopRunRequest<'excel.setCell', ExcelSetCellActionInput>
    | DesktopRunRequest<'excel.setCells', ExcelSetCellsActionInput>
    | DesktopRunRequest<'excel.findFirstEmptyRow', ExcelFindFirstEmptyRowActionInput>
    | DesktopRunRequest<'excel.clearCells', ExcelClearCellsActionInput>
    | DesktopRunRequest<'excel.deleteColumns', ExcelDeleteColumnsActionInput>
    | DesktopRunRequest<'excel.createWorksheet', ExcelCreateWorksheetActionInput>
    | DesktopRunRequest<'excel.renameWorksheet', ExcelRenameWorksheetActionInput>
    | DesktopRunRequest<'excel.setActiveWorksheet', ExcelSetActiveWorksheetActionInput>
    | DesktopRunRequest<'excel.insertColumnsBefore', ExcelInsertColumnsActionInput>
    | DesktopRunRequest<'excel.insertColumnsAfter', ExcelInsertColumnsActionInput>
    | DesktopRunRequest<"excel.insertRowsBefore", ExcelInsertRowsActionInput>
    | DesktopRunRequest<'excel.deleteWorksheet', ExcelDeleteWorksheetActionInput>
    | DesktopRunRequest<'excel.worksheetExists', ExcelWorksheetExistActionInput>
    | DesktopRunRequest<'excel.insertRowsAfter', ExcelInsertRowsActionInput>;

export interface ExcelOpenActionInput {
    path: string;
    worksheet?: string;
    mode?: 'xlReadOnly' | 'xlReadWrite';
}

export interface ExcelWorksheetExistActionInput {
    worksheet: string;
}

export interface ExcelGetCellActionInput {
    targetCell: string;
    worksheet?: string;
}

export type ExcelGetCellsActionInput = {
    startCell: string;
    endCell: string;
    worksheet?: string;
};

export interface ExcelSaveActionInput {
    fileName: string;
}

export interface ExcelSetCellActionInput {
    targetCell: string;
    value: ExcelCellContent;
    worksheet?: string;
}

export interface ExcelSetCellsActionInput {
    startCell: string;
    cellValues: ExcelCellContent[][];
    worksheet?: string;
}

export interface ExcelFindFirstEmptyRowActionInput {
    startCell: string;
    worksheet?: string;
}

export interface ExcelDeleteColumnsActionInput {
    columnRange: string;
    worksheet?: string;
}

export interface CellCoordinates {
    column: number;
    row: number;
}

export interface ExcelClearCellsActionInput {
    targetCells: string[] | string;
    worksheet?: string;
}

export type ExcelInsertColumnsActionInput = {
    column: string;
    amount: number;
    worksheet?: string;
};

export interface ExcelCreateWorksheetActionInput {
    name?: string;
}

export type ExcelInsertRowsActionInput = {
    startingRow: number;
    rowsNumber: number;
    worksheet?: string;
};

export interface ExcelCreateWorksheetActionInput {
    name?: string;
}

export interface ExcelRenameWorksheetActionInput {
    newName: string;
    worksheet?: string;
};

export interface ExcelSetActiveWorksheetActionInput {
    worksheet: string;
}

export interface ExcelDeleteWorksheetActionInput {
    worksheet: string;
}

export type ExcelCreateWorksheetActionOutput = string;

export type ExcelCellContent = string | number | boolean;