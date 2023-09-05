import { MicrosoftCloudPlatform } from 'runbotics-common';
import { DesktopRunRequest } from 'runbotics-sdk';

export type FileActionRequest =
| DesktopRunRequest<'excelCloud.setCell', ExcelCloudSetCellActionInput>
| DesktopRunRequest<'sharepointExcel.getCell', SharepointGetExcelCellActionInput>
| DesktopRunRequest<'sharepointExcel.closeSession', SharepointExcelCloseSessionActionInput>
| DesktopRunRequest<'sharepointExcel.updateRange', SharepointExcelUpdateRangeActionInput>
| DesktopRunRequest<'sharepointExcel.getRange', SharepointExcelGetRangeActionInput>
| DesktopRunRequest<'excelCloud.openWorkbook', ExcelCloudOpenWorkbookActionInput>;

export interface ExcelCloudOpenWorkbookActionInput {
    platform: MicrosoftCloudPlatform;
    workbookPath: string;
    worksheet: string;
    persistChanges: boolean;
    site?: string;
    list?: string;
}

export type ExcelCloudSetCellActionInput = {
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
export type SharepointExcelGetCellActionOutput = any;

export type SharepointExcelGetRangeActionInput = {
    range: string;
};
export type SharepointExcelGetRangeActionOutput = any;

export type SharepointExcelCloseSessionActionInput = any;

export type SharepointExcelCloseSessionActionOutput = any;
