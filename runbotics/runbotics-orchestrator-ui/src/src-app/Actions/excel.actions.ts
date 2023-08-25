import { ExcelAction } from 'runbotics-common';

import excelActions from './ExcelActions';
import { IBpmnAction } from './types';

const getExcelActions: () => Record<string, IBpmnAction> = () => ({
    [ExcelAction.CLEAR_CELLS]: excelActions.getActionClearCells(),
    [ExcelAction.CLOSE]: excelActions.getActionClose(),
    [ExcelAction.CREATE_WORKSHEET]: excelActions.getActionCreateWorksheet(),
    [ExcelAction.DELETE_COLUMNS]: excelActions.getActionDeleteColumns(),
    [ExcelAction.DELETE_WORKSHEET]: excelActions.getActionDeleteWorksheet(),
    [ExcelAction.FIND_FIRST_EMPTY_ROW]: excelActions.getActionFindFirstEmptyRow(),
    [ExcelAction.GET_CELL]: excelActions.getActionGetCell(),
    [ExcelAction.GET_CELLS]: excelActions.getActionGetCells(),
    [ExcelAction.RUN_MACRO]: excelActions.getActionRunMacro(),
    [ExcelAction.INSERT_COLUMNS_AFTER]: excelActions.getActionInsertColumnsAfter(),
    [ExcelAction.INSERT_COLUMNS_BEFORE]: excelActions.getActionInsertColumnsBefore(),
    [ExcelAction.INSERT_ROWS_AFTER]: excelActions.getActionInsertRowAfter(),
    [ExcelAction.INSERT_ROWS_BEFORE]: excelActions.getActionInsertRowBefore(),
    [ExcelAction.DELETE_ROWS]: excelActions.getActionDeleteRows(),
    [ExcelAction.OPEN]: excelActions.getActionOpen(),
    [ExcelAction.READ_TABLE]: excelActions.getActionReadTable(),
    [ExcelAction.RENAME_WORKSHEET]: excelActions.getActionRenameWorksheet(),
    [ExcelAction.SAVE]: excelActions.getActionSave(),
    [ExcelAction.SET_ACTIVE_WORKSHEET]: excelActions.getActionSetActiveWorksheet(),
    [ExcelAction.SET_CELL]: excelActions.getActionSetCell(),
    [ExcelAction.SET_CELLS]: excelActions.getActionSetCells(),
    [ExcelAction.WORKSHEET_EXISTS]: excelActions.getActionWorksheetExists(),

});

export default getExcelActions;
