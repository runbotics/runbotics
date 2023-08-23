export type SessionIdentifier = number | string;
export type WorksheetIdentifier = number | string;

export interface Session {
    sessionIdentifier: SessionIdentifier;
    worksheetIdentifier: WorksheetIdentifier;
    workbookSessionInfo: WorkbookSessionInfo;
    token: string;
}

export interface WorkbookSessionInfo {
    id: string;
    persistChanges: boolean;
}

export interface WorkbookCellCoordinates {
    row: number;
    column: number;
}

export interface WorkbookRange {
    address: string;
    addressLocal: string;
    cellCount: number;
    columnCount: number;
    columnHidden: boolean;
    columnIndex: number;
    formulas: string;
    formulasLocal: string;
    formulasR1C1: string;
    hidden: boolean;
    numberFormat: string;
    rowCount: number;
    rowHidden: boolean;
    rowIndex: number;
    text: string;
    valueTypes: string;
    values: string;
}

export interface WorkbookRangeUpdateBody {
    columnHidden: boolean;
    formulas: string;
    formulasLocal: string;
    formulasR1C1: string;
    numberFormat: string;
    rowHidden: boolean;
    values: string;
}