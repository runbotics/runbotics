import { ExcelCellValue, Platform } from '#action/microsoft/excel/excel.types';
import { DesktopRunRequest } from 'runbotics-sdk';

export type FileActionRequest =
| DesktopRunRequest<'sharepointExcel.setCell', SharepointSetExcelCellActionInput>
| DesktopRunRequest<'sharepointExcel.getCell', SharepointGetExcelCellActionInput>
| DesktopRunRequest<'sharepointExcel.closeSession'>
| DesktopRunRequest<'sharepointExcel.updateRange', SharepointExcelUpdateRangeActionInput>
| DesktopRunRequest<'sharepointExcel.getCells', SharepointExcelGetCellsActionInput>
| DesktopRunRequest<'sharepointExcel.openFile', SharepointExcelOpenFileActionInput>;

export interface SharepointExcelOpenFileActionInput {
    platform: Platform;
    filePath: string;
    worksheetName?: string;
    siteName: string;
    listName?: string;
}

export type SharepointOpenActionOutput = any;

export type SharepointSetExcelCellActionInput = {
    value: string;
    cell: string;
};

export type SharepointExcelUpdateRangeActionInput = {
    range: string;
    values: string | (string | number | boolean)[][];
};
export type SharepointExcelUpdateRangeActionOutput = any;

export type SharepointGetExcelCellActionInput = {
    cell: string;
};
export type SharepointExcelGetCellActionOutput = ExcelCellValue;

export type SharepointExcelGetCellsActionInput = {
    startCell: string;
    endCell: string;
};
export type SharepointExcelGetCellsActionOutput = ExcelCellValue[][];

export type SharepointExcelCloseSessionActionOutput = any;
