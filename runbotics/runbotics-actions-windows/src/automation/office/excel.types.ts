import { DesktopRunRequest } from "runbotics-sdk";

export type ExcelActionRequest =
    | DesktopRunRequest<"excel.open", ExcelOpenActionInput>
    | DesktopRunRequest<"excel.getCell", ExcelGetCellActionInput>
    | DesktopRunRequest<"excel.getCells", ExcelGetCellsActionInput>
    | DesktopRunRequest<"excel.close">
    | DesktopRunRequest<"excel.save">
    | DesktopRunRequest<"excel.setCell", ExcelSetCellActionInput>
    | DesktopRunRequest<"excel.setCells", ExcelSetCellsActionInput>
    | DesktopRunRequest<"excel.findFirstEmptyRow", ExcelFindFirstEmptyRowActionInput>
    | DesktopRunRequest<"excel.clearCells", ExcelClearCellsActionInput>
    | DesktopRunRequest<"excel.deleteColumns", ExcelDeleteColumnsActionInput>
    | DesktopRunRequest<"excel.createWorksheet", ExcelCreateWorksheetActionInput>
    | DesktopRunRequest<"excel.renameWorksheet", ExcelRenameWorksheetActionInput>
    | DesktopRunRequest<"excel.setActiveWorksheet", ExcelSetActiveWorksheetActionInput>
    | DesktopRunRequest<"excel.insertColumnsBefore", ExcelInsertColumnsActionInput>
    | DesktopRunRequest<"excel.insertColumnsAfter", ExcelInsertColumnsActionInput>
    | DesktopRunRequest<"excel.insertRowsAfter", ExcelInsertRowsActionInput>;

export interface ExcelOpenActionInput {
    path: string;
    worksheet?: string;
    mode?: "xlReadOnly" | "xlReadWrite";
}

export interface ExcelGetCellActionInput {
    row: number;
    column: string;
    worksheet?: string;
}

export type ExcelGetCellsActionInput = {
    startColumn?: string;
    startRow?: string;
    endColumn: string;
    endRow: string;
    worksheet?: string;
};

export interface ExcelSaveActionInput {
    fileName: string;
}

export interface ExcelSetCellActionInput {
    row: number;
    column: string;
    value: unknown;
    worksheet?: string;
}

export interface ExcelSetCellsActionInput {
    cellValues: ExcelArrayStructure;
    startColumn?: string;
    startRow?: string;
    worksheet?: string;
}

export interface ExcelFindFirstEmptyRowActionInput {
    startColumn?: string;
    startRow?: string;
    worksheet?: string;
}

export interface StartCellCoordinates {
    startColumn: number;
    startRow: number;
}

export interface ExcelDeleteColumnsActionInput {
    columnRange: string;
    worksheet?: string;
}

export interface GetCellCoordinatesParams {
    startColumn?: number | string;
    startRow?: number;
    endColumn?: number | string;
    endRow?: number;
}

export interface CellCoordinates {
    startColumn?: number;
    startRow?: number;
    endColumn?: number;
    endRow?: number;
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

export type ExcelInsertRowsActionInput = {
    startingRow: number;
    rowsNumber: number;
    worksheet?: string;
};

export interface ExcelCreateWorksheetActionInput {
    name?: string;
};

export type ExcelCreateWorksheetActionOutput = string

export interface ExcelRenameWorksheetActionInput {
    worksheet?: string;
    newName: string;
};

export interface ExcelSetActiveWorksheetActionInput {
    worksheet: string;
};

export type ExcelArrayStructure = (string | number | boolean)[][];
