import { Platform } from '#action/microsoft/excel/excel.types';
import { DesktopRunRequest } from 'runbotics-sdk';

export type FileActionRequest =
| DesktopRunRequest<'sharepointExcel.setCell', SharepointSetExcelCellActionInput>
| DesktopRunRequest<'sharepointExcel.getCell', SharepointGetExcelCellActionInput>
| DesktopRunRequest<'sharepointExcel.closeSession', SharepointExcelCloseSessionActionInput>
| DesktopRunRequest<'sharepointExcel.updateRange', SharepointExcelUpdateRangeActionInput>
| DesktopRunRequest<'sharepointExcel.getRange', SharepointExcelGetRangeActionInput>
| DesktopRunRequest<'sharepointExcel.openFile', SharepointExcelOpenFileActionInput>;

export interface SharepointExcelOpenFileActionInput {
    platform: Platform;
    filePath: string;
    worksheetName: string;
    persistChanges: boolean;
    siteName: string;
    listName: string;
}

export type SharepointOpenActionOutput = any;

export type SharepointSetExcelCellActionInput = {
    content: string;
    cell: string;
};
export type SharepointExcelSetCellActionOutput = any;

export type SharepointExcelUpdateRangeActionInput = {
    range: string;
    values: string | (string | number | boolean)[][];
};
export type SharepointExcelUpdateRangeActionOutput = any;

export type SharepointGetExcelCellActionInput = {
    cell: string;
};
export type SharepointExcelGetCellActionOutput = any;

export type SharepointExcelGetRangeActionInput = {
    range: string;
};
export type SharepointExcelGetRangeActionOutput = any;

export type SharepointExcelCloseSessionActionInput = any;

export type SharepointExcelCloseSessionActionOutput = any;

export type ExcelCellValue = string | number | boolean;