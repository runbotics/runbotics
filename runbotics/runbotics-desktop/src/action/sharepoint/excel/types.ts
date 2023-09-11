import { Platform } from '#action/microsoft/excel/excel.types';
import { DesktopRunRequest } from 'runbotics-sdk';

export type FileActionRequest =
| DesktopRunRequest<'sharepointExcel.setCell', SharepointSetExcelCellActionInput>
| DesktopRunRequest<'sharepointExcel.getCell', SharepointGetExcelCellActionInput>
| DesktopRunRequest<'sharepointExcel.closeSession', SharepointExcelCloseSessionActionInput>
| DesktopRunRequest<'sharepointExcel.updateRange', SharepointExcelUpdateRangeActionInput>
| DesktopRunRequest<'sharepointExcel.getCells', SharepointExcelGetCellsActionInput>
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

export type SharepointExcelGetCellsActionInput = {
    startCell: string;
    endCell: string;
};
export type SharepointExcelGetCellsActionOutput = any;

export type SharepointExcelCloseSessionActionInput = any;

export type SharepointExcelCloseSessionActionOutput = any;
