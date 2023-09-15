import { CloudExcelAction } from 'runbotics-common';
import { DesktopRunRequest } from 'runbotics-sdk';

import { ExcelSessionInfo } from '#action/microsoft/excel/excel.types';

export type CloudExcelActionRequest =
| DesktopRunRequest<CloudExcelAction.SET_CELL, CloudExcelSetCellActionInput>
| DesktopRunRequest<CloudExcelAction.GET_CELL, CloudGetExcelCellActionInput>
| DesktopRunRequest<CloudExcelAction.CLOSE_SESSION>
| DesktopRunRequest<CloudExcelAction.SET_CELLS, CloudExcelSetCellsActionInput>
| DesktopRunRequest<CloudExcelAction.GET_CELLS, CloudExcelGetCellsActionInput>
| DesktopRunRequest<CloudExcelAction.OPEN_FILE, ExcelSessionInfo>;

export type CloudExcelSetCellActionInput = {
    content: string;
    cell: string;
};

export type CloudExcelSetCellsActionInput = {
    startCell: string;
    values: (string | number | boolean)[][];
};

export type CloudGetExcelCellActionInput = {
    cell: string;
};

export type CloudExcelGetCellsActionInput = {
    startCell: string;
    endCell: string;
};
