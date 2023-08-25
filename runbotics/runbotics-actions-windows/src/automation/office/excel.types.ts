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
    | DesktopRunRequest<'excel.runMacro', ExcelRunMacroInput>
    | DesktopRunRequest<'excel.insertRowsAfter', ExcelInsertRowsActionInput>
    | DesktopRunRequest<'excel.worksheetExists', ExcelWorksheetExistActionInput>
    | DesktopRunRequest<"excel.insertRowsBefore", ExcelInsertRowsActionInput>
    | DesktopRunRequest<'excel.deleteWorksheet', ExcelDeleteWorksheetActionInput>
    | DesktopRunRequest<'excel.worksheetExists', ExcelWorksheetExistActionInput>
    | DesktopRunRequest<'excel.insertRowsAfter', ExcelInsertRowsActionInput>
    | DesktopRunRequest<'excel.deleteRows', ExcelDeleteRowsActionInput>
    | DesktopRunRequest<'excel.readTable', ExcelReadTableActionInput>;

export interface ExcelOpenActionInput {
    path: string;
    worksheet?: string;
    mode?: 'xlReadOnly' | 'xlReadWrite';
}

export interface ExcelWorksheetExistActionInput {
    worksheet: string;
}

export interface ExcelReadTableActionInput {
    tableName: string;
    shouldIncludeHeaders: boolean;
    worksheet?: string;
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
    value: ExcelCellValue;
    worksheet?: string;
}

export interface ExcelSetCellsActionInput {
    startCell: string;
    cellValues: ExcelCellValue[][];
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

export interface ExcelDeleteRowsActionInput {
    rowRange: string;
    worksheet?: string;
}

export interface GetCellCoordinatesParams {
    startColumn?: number | string;
    startRow?: number;
    endColumn?: number | string;
    endRow?: number;
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

export type ExcelRunMacroInput = {
    macro: string;
    functionParams?: Array<string>;
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

export interface ExcelDeleteWorksheetActionInput {
    worksheet: string;
}

export type ExcelCreateWorksheetActionOutput = string;

export type ExcelCellValue = string | number | boolean;
