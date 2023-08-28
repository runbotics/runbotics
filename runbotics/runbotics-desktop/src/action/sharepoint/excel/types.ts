import { DesktopRunRequest } from 'runbotics-sdk';

export type FileActionRequest =
| DesktopRunRequest<'sharepointExcel.setCell', SharepointSetExcelCellActionInput>
| DesktopRunRequest<'sharepointExcel.getCell', SharepointGetExcelCellActionInput>
| DesktopRunRequest<'sharepointExcel.openFileFromSite', SharepointOpenFromSiteActionInput>
| DesktopRunRequest<'sharepointExcel.openFileFromRoot', SharepointOpenFromRootActionInput>
| DesktopRunRequest<'sharepointExcel.closeSession', SharepointExcelCloseSessionActionInput>
| DesktopRunRequest<'sharepointExcel.updateRange', SharepointExcelUpdateRangeActionInput>
| DesktopRunRequest<'sharepointExcel.getRange', SharepointExcelGetRangeActionInput>
| DesktopRunRequest<'sharepointExcel.openFile', SharepointExcelOpenFileActionInput>;

export interface SharepointExcelOpenFileActionInput {
    platform:string;
    filePath:string;
    worksheetName:string;
    persistChanges: boolean;
    siteRelativePath: string;
    listName: string;
}
export type SharepointOpenFromRootActionInput = {
    filePath: string;
    worksheetName: string;
    persistChanges: boolean;
};
export type SharepointOpenFromSiteActionInput = {
    siteRelativePath: string;
    listName: string;
    filePath: string;
    worksheetName: string;
    persistChanges: boolean;
};
export type SharepointOpenActionOutput = any;

export type SharepointSetExcelCellActionInput = {
    content: string;
    cell: string;
};
export type SharepointExcelSetCellActionOutput = any;

export type SharepointExcelUpdateRangeActionInput = {
    range: string;
    values: string | any[][];
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
