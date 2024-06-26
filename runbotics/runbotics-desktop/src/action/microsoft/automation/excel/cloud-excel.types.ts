import { CloudExcelAction } from 'runbotics-common';
import { DesktopRunRequest } from '@runbotics/runbotics-sdk';

import { ExcelSessionInfo, ExcelCellValue, Worksheet } from '#action/microsoft/excel/excel.types';

export type CloudExcelActionRequest =
    | DesktopRunRequest<CloudExcelAction.SET_CELL, CloudExcelSetCellActionInput>
    | DesktopRunRequest<CloudExcelAction.GET_CELL, CloudGetExcelCellActionInput>
    | DesktopRunRequest<CloudExcelAction.CLOSE_SESSION>
    | DesktopRunRequest<CloudExcelAction.SET_CELLS, CloudExcelSetCellsActionInput>
    | DesktopRunRequest<CloudExcelAction.GET_CELLS, CloudExcelGetCellsActionInput>
    | DesktopRunRequest<CloudExcelAction.OPEN_FILE, ExcelSessionInfo>
    | DesktopRunRequest<CloudExcelAction.CREATE_WORKSHEET, CloudExcelCreateWorksheetActionInput>
    | DesktopRunRequest<CloudExcelAction.DELETE_WORKSHEET, CloudExcelDeleteWorksheetActionInput>
    | DesktopRunRequest<CloudExcelAction.DELETE_COLUMNS, CloudExcelDeleteColumnsActionInput>
    | DesktopRunRequest<CloudExcelAction.DELETE_ROWS, CloudExcelDeleteRowsActionInput>
    | DesktopRunRequest<CloudExcelAction.GET_WORKSHEET_CONTENT, CloudExcelGetWorksheetContentActionInput>;

export type CloudExcelSetCellActionInput = {
    value: string;
    cell: string;
};

export type CloudExcelSetCellsActionInput = {
    startCell: string;
    values: ExcelCellValue[][];
};

export type CloudGetExcelCellActionInput = {
    cell: string;
    isStringExpected: boolean;
};

export type CloudExcelGetCellsActionInput = {
    startCell: string;
    endCell: string;
    isStringExpected: boolean;
};

export type CloudExcelCreateWorksheetActionInput = {
    worksheetName: Worksheet['name'];
};

export type CloudExcelDeleteWorksheetActionInput = {
    worksheetName: Worksheet['name'];
}

export type CloudExcelDeleteColumnsActionInput = {
    startColumn: string;
    endColumn?: string;
};

export type CloudExcelGetWorksheetContentActionInput = {
    worksheetName: Worksheet['name'];
}

export type CloudExcelDeleteRowsActionInput = {
    rowRange: string | number[];
    worksheet?: string;
};