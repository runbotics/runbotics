import getActionClearCells from './clearCells';
import getActionClose from './close';
import getActionCreateWorksheet from './createWorksheet';
import getActionDeleteColumns from './deleteColumns';
import getActionDeleteWorksheet from './deleteWorksheet';
import getActionFindFirstEmptyRow from './findFirstEmptyRow';
import getActionGetCell from './getCell';
import getActionGetCells from './getCells';
import getActionInsertColumnsAfter from './insertColumnsAfter';
import getActionInsertColumnsBefore from './insertColumnsBefore';
import getActionInsertRowAfter from './insertRowAfter';
import getActionInsertRowBefore from './insertRowBefore';
import getActionOpen from './open';
import getActionRenameWorksheet from './renameWorksheet';
import getActionSave from './save';
import getActionSetActiveWorksheet from './setActiveWorksheet';
import getActionSetCell from './setCell';
import getActionSetCells from './setCells';
import getActionWorksheetExists from './worksheetExists';

const excelActions = {
    getActionClearCells,
    getActionClose,
    getActionCreateWorksheet,
    getActionDeleteColumns,
    getActionDeleteWorksheet,
    getActionFindFirstEmptyRow,
    getActionGetCell,
    getActionGetCells,
    getActionInsertColumnsAfter,
    getActionInsertColumnsBefore,
    getActionInsertRowAfter,
    getActionInsertRowBefore,
    getActionOpen,
    getActionRenameWorksheet,
    getActionSave,
    getActionSetActiveWorksheet,
    getActionSetCell,
    getActionSetCells,
    getActionWorksheetExists,
};

export default excelActions;
