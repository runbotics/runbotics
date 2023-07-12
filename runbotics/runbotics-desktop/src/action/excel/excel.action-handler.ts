import { Injectable } from '@nestjs/common';
import { StatefulActionHandler } from 'runbotics-sdk';
import { RunboticsLogger } from '#logger';
import * as ExcelTypes from './excel.types';
import { runPythonScript } from '#action/actions.python';
import { PYTHON_SCRIPT_DIRECTORY } from './excel.utils';

@Injectable()
export default class DesktopExcelActionHandler extends StatefulActionHandler {
    private logger = new RunboticsLogger(DesktopExcelActionHandler.name);

    constructor() {
        super();
    }

    /**
     *  @name Set Cell Value
     *  @description Opens target Excel file, sets given value of target cell and saves the file.
     *  @param path - Absolute path to Excel file (including filename).
     *  @param row - Row number.
     *  @param column - Column number or letter.
     *  @param value - Value to be set.
     *  @example path: C:/myDir/myExcelFile.xlsx row: 1 column: B value: 'myValue'
     */
    async setCellValue(input: ExcelTypes.ExcelSetCellValueActionInput): Promise<ExcelTypes.ExcelSetCellValueActionOutput> {
        try {
            const PYTHON_SCRIPT_NAME = 'set_cell_value.py';
            const args = [
                input.path,
                input.row,
                input.column,
                input.value
            ];

            await runPythonScript(args, PYTHON_SCRIPT_DIRECTORY, PYTHON_SCRIPT_NAME)
                .then(() => this.logger.log('Success: python script executed successfully'));
        } catch (err) {
            this.logger.error(`Error: ${err}`);
            throw new Error(err?.description ?? err);
        }
    }

    async run(request: any) {
        if (process.platform !== 'win32') {
            throw new Error('Excel desktop actions can be run only on Windows bot');
        }

        switch (request.script) {
            case 'excel.setCellValue':
                return this.setCellValue(request.input);
            default:
                throw new Error('Action not found');
        }
    }

    async tearDown(): Promise<void> {}
}