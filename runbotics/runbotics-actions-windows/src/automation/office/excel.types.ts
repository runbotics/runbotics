import { DesktopRunRequest } from "runbotics-sdk";

export type ExcelActionRequest =
    | DesktopRunRequest<"excel.open", ExcelOpenActionInput>
    | DesktopRunRequest<"excel.getCell", ExcelGetCellActionInput>
    | DesktopRunRequest<"excel.close">
    | DesktopRunRequest<"excel.save">
    | DesktopRunRequest<"excel.setCell", ExcelSetCellActionInput>
    | DesktopRunRequest<"excel.setCells", ExcelSetCellsActionInput>
    | DesktopRunRequest<"excel.setFirstEmptyRow", ExcelSetFirstEmptyRowActionInput>;

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

export type ExcelSetFirstEmptyRowActionInput = {
    values: unknown[][];
    startColumn?: string;
    startRow?: string;
    worksheet?: string;
}
export interface StartCellCoordinates {
    startColumn: number;
    startRow: number;
}

export type ExcelArrayStructure = unknown[][]
