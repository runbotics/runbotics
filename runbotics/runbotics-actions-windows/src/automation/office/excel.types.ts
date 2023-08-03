import { DesktopRunRequest } from "runbotics-sdk";

export type ExcelActionRequest =
    | DesktopRunRequest<"excel.open", ExcelOpenActionInput>
    | DesktopRunRequest<"excel.getCell", ExcelGetCellActionInput>
    | DesktopRunRequest<"excel.close">
    | DesktopRunRequest<"excel.save">
    | DesktopRunRequest<"excel.setCell", ExcelSetCellActionInput>
    | DesktopRunRequest<"excel.setCells", ExcelSetCellsActionInput>
    | DesktopRunRequest<"excel.findFirstEmptyRow", ExcelFindFirstEmptyRowActionInput>
    | DesktopRunRequest<"excel.clearCells", ExcelClearCellsActionInput>;

export type ExcelOpenActionInput = {
    path: string;
    worksheet?: string;
    mode?: "xlReadOnly" | "xlReadWrite";
};

export type ExcelGetCellActionInput = {
    row: number;
    column: string;
    worksheet?: string;
};

export interface ExcelSaveActionInput {
    fileName: string;
}

export type ExcelSetCellActionInput = {
    row: number;
    column: string;
    value: unknown;
    worksheet?: string;
};

export type ExcelSetCellsActionInput = {
    cellValues: ExcelArrayStructure;
    startColumn?: string;
    startRow?: string;
    worksheet?: string;
};

export type ExcelFindFirstEmptyRowActionInput = {
    startColumn?: string;
    startRow?: string;
    worksheet?: string;
}
export interface StartCellCoordinates {
    startColumn: number;
    startRow: number;
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

export type ExcelClearCellsActionInput = {
    targetCells: string[] | string;
    worksheet?: string;
};

export type ExcelArrayStructure = unknown[][]
