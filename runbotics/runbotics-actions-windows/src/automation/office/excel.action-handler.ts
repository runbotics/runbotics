import { Injectable } from '@nestjs/common';
import { StatefulActionHandler } from 'runbotics-sdk';
import ExcelErrorMessage from './excelErrorMessage';
import {
    ExcelActionRequest,
    ExcelGetCellActionInput,
    ExcelOpenActionInput,
    ExcelSaveActionInput,
    ExcelSetCellActionInput,
    ExcelSetCellsActionInput,
    ExcelFindFirstEmptyRowActionInput,
    CellCoordinates,
    ExcelGetCellsActionInput,
    ExcelClearCellsActionInput,
    ExcelDeleteColumnsActionInput,
    ExcelCreateWorksheetActionInput,
    ExcelCreateWorksheetActionOutput,
    ExcelRenameWorksheetActionInput,
    ExcelSetActiveWorksheetActionInput,
    ExcelInsertColumnsActionInput,
    ExcelDeleteWorksheetActionInput,
    ExcelWorksheetExistActionInput,
    ExcelInsertRowsActionInput,
    ExcelCellContent,
    RegexPatterns,
} from './excel.types';

@Injectable()
export default class ExcelActionHandler extends StatefulActionHandler {
    private session = null;

    constructor() {
        super();
    }

    async open(input: ExcelOpenActionInput): Promise<void> {
        const winax = await import('winax');
        this.session = new winax.Object('Excel.Application', { activate: true });
        this.session.Workbooks.Open(input.path);
        this.session.Visible = true;
        this.session.Application.DisplayAlerts = false;
        if (input.worksheet) {
            this.checkIsWorksheetNameCorrect(input.worksheet, true);
            this.session.Worksheets(input.worksheet).Activate();
        }

        // if (input.mode) {
        //     excel.ActiveWorkbook.ChangeFileAccess(input.mode);
        // }
    }

    /**
     * @description Closes Excel application ignoring unsaved changes
     */
    async close(): Promise<void> {
        this.session?.Quit();

        this.session = null;
    }

    async save(input: ExcelSaveActionInput) {
        if (input.fileName) {
            this.session.ActiveWorkbook.SaveAs(input.fileName);
        } else {
            this.session.ActiveWorkbook.Save();
        }
    }

    async getCell(
        input: ExcelGetCellActionInput
    ): Promise<unknown> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        return this.session
            .Worksheets(input.worksheet ?? this.session.ActiveSheet.Name)
            .Range(input.targetCell)
            .Value();
    }

    async getCells(
        input: ExcelGetCellsActionInput
    ): Promise<unknown[][]> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        try {
            const cellValues: ExcelCellContent[][] = [];
            const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
            const { column: startColumn, row: startRow } = this.getDividedCellCoordinates(input.startCell);
            const { column: endColumn, row: endRow } = this.getDividedCellCoordinates(input.endCell);

            for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
                const rowValues: ExcelCellContent[] = [];
                for (let columnIdx = startColumn; columnIdx <= endColumn; columnIdx++) {
                    rowValues.push(
                        targetWorksheet
                            .Cells(rowIdx, columnIdx)
                            .Value()
                        ?? ''
                    );
                }
                cellValues.push(rowValues);
            }

            return cellValues;
        } catch (e) {
            throw new Error(ExcelErrorMessage.getCellsIncorrectInput());
        }
    }

    async setCell(
        input: ExcelSetCellActionInput
    ): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        try {
            const cell = this.session
                .Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name)
                .Range(input.targetCell)

            cell.Value = input.value;
        } catch (e) {
            throw new Error(ExcelErrorMessage.setCellIncorrectInput());
        }
    }

    async setCells(
        input: ExcelSetCellsActionInput
    ): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const cellValues = this.parseExcelStructureArray(input.cellValues, ExcelErrorMessage.setCellsIncorrectInput());
        const { row: startRow, column: startColumn } = this.getDividedCellCoordinates(input.startCell);
        let columnCounter = startColumn,
            rowCounter = startRow;
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
        for (const rowValues of cellValues) {
            for (const cellValue of rowValues) {
                try {
                    if (cellValue !== null) targetWorksheet.Cells(rowCounter, columnCounter).Value = cellValue;
                    columnCounter++;
                } catch (e) {
                    throw new Error(ExcelErrorMessage.setCellsIncorrectInput());
                }
            }
            rowCounter++;
            columnCounter = startColumn;
        }
    }

    async findFirstEmptyRow(
        input: ExcelFindFirstEmptyRowActionInput
    ): Promise<number> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const { column: startColumn, row: startRow } = this.getDividedCellCoordinates(input.startCell);
        let rowCounter = startRow;
        while (
            this.session
                .Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name)
                .Cells(rowCounter, startColumn)
                .Value()
        )
            rowCounter++;
        return rowCounter;
    }

    async deleteColumns(
        input: ExcelDeleteColumnsActionInput
    ): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const columnRange = this.parseOneDimensionalArray(input.columnRange);
        try {
            const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
            if (!Array.isArray(columnRange)) targetWorksheet.Columns(columnRange).Delete();
            else {
                const sortedColumns = this.sortColumns(columnRange);
                sortedColumns.forEach((column, idx) => {
                    const columnCoordinate = this.getColumnCoordinate(column);
                    targetWorksheet.Columns(columnCoordinate - idx).Delete();
                });
            }
        } catch (e) {
            throw new Error(ExcelErrorMessage.deleteColumnsIncorrectInput());
        }
    }

    async createWorksheet(input: ExcelCreateWorksheetActionInput): Promise<ExcelCreateWorksheetActionOutput> {
        const worksheets = this.session.Worksheets;
        const worksheetsCount = worksheets.Count;
        let worksheet: string;

        if (input?.name) {
            this.checkIsWorksheetNameCorrect(input.name, false);
            worksheet = (this.session.Worksheets
                .Add(null, this.session.Worksheets(worksheetsCount))
                .Name = input.name);
        } else {
            worksheet = this.session.Worksheets.Add(null, this.session.Worksheets(worksheetsCount)).Name;
        }

        return worksheet;
    }

    async renameWorksheet(
        input: ExcelRenameWorksheetActionInput
    ): Promise<void> {
        this.checkIsWorksheetNameCorrect(input.newName, false);

        if (input?.worksheet) {
            this.checkIsWorksheetNameCorrect(input.worksheet, true);
            this.session.Worksheets(input.worksheet).Name = input.newName;
        } else {
            this.session.ActiveSheet.Name = input.newName;
        }
    }

    async setActiveWorksheet(input: ExcelSetActiveWorksheetActionInput): Promise<void> {
        if (input.worksheet === this.session.ActiveSheet.Name) return;

        this.checkIsWorksheetNameCorrect(input.worksheet, true);
        this.session.Worksheets(input.worksheet).Activate();
    }

    async insertColumnsBefore(
        input: ExcelInsertColumnsActionInput
    ): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);

        try {
            const column = this.getColumnCoordinate(input.column);
            const amount = input.amount;

            targetWorksheet
                .Range(targetWorksheet.Columns(column), targetWorksheet.Columns(column + amount - 1))
                .Insert();
        } catch (e) {
            throw new Error(ExcelErrorMessage.insertColumnsIncorrectInput());
        }
    }

    async insertColumnsAfter(
        input: ExcelInsertColumnsActionInput
    ): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);

        try {
            const column = this.getColumnCoordinate(input.column);
            const amount = input.amount;

            targetWorksheet
                .Range(targetWorksheet.Columns(column + 1), targetWorksheet.Columns(column + amount))
                .Insert();
        } catch (e) {
            throw new Error(ExcelErrorMessage.insertColumnsIncorrectInput());
        }
    }

    async insertRowsBefore(
        input: ExcelInsertRowsActionInput
    ): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
        const startingRow = input.startingRow;
        const rowsNumber = input.rowsNumber

        try {
            targetWorksheet
                .Range(
                    targetWorksheet.Rows(startingRow),
                    targetWorksheet.Rows(startingRow + rowsNumber - 1))
                .Insert();
        } catch (e) {
            throw new Error(ExcelErrorMessage.insertRowsIncorrectInput());
        }
    }

    async insertRowsAfter(
        input: ExcelInsertRowsActionInput
    ): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
        const startingRow = input.startingRow;
        const rowsNumber = input.rowsNumber

        try {
            targetWorksheet
                .Range(targetWorksheet.Rows(startingRow + 1), targetWorksheet.Rows(startingRow + rowsNumber))
                .Insert();
        } catch (e) {
            throw new Error(ExcelErrorMessage.insertRowsIncorrectInput());
        }
    }

    async clearCells(
        input: ExcelClearCellsActionInput
    ): Promise<void> {
        if (input.worksheet) this.checkIsWorksheetNameCorrect(input.worksheet, true);
        const targetCells = this.parseOneDimensionalArray(input.targetCells);
        try {
            const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
            if (!Array.isArray(targetCells)) targetWorksheet.Range(targetCells).Clear();
            else for (const cellCoordinate of targetCells) targetWorksheet.Range(cellCoordinate).Clear();
        } catch (e) {
            throw new Error(ExcelErrorMessage.clearCellsIncorrectInput());
        }
    }

    async deleteWorksheet(input: ExcelDeleteWorksheetActionInput): Promise<void> {
        this.checkIsWorksheetNameCorrect(input.worksheet, true)

        const targetWorksheet = this.session.Worksheets(input.worksheet);

        targetWorksheet.Delete();
    }

    async isWorksheetPresent(
        input: ExcelWorksheetExistActionInput
    ): Promise<boolean> {
        return this.checkIfWorksheetExist(input.worksheet);
    }

    run(request: ExcelActionRequest) {
        if (process.platform !== 'win32') {
            throw new Error('Excel actions can be run only on Windows bot');
        }

        if (request.script !== 'excel.open') {
            this.isApplicationOpen();
        }

        switch (request.script) {
            case 'excel.open':
                return this.open(request.input);
            case 'excel.getCell':
                return this.getCell(request.input);
            case 'excel.getCells':
                return this.getCells(request.input);
            case 'excel.setCell':
                return this.setCell(request.input);
            case 'excel.findFirstEmptyRow':
                return this.findFirstEmptyRow(request.input);
            case 'excel.clearCells':
                return this.clearCells(request.input);
            case 'excel.setCells':
                return this.setCells(request.input);
            case 'excel.worksheetExists':
                return this.isWorksheetPresent(request.input);
            case 'excel.createWorksheet':
                return this.createWorksheet(request.input);
            case 'excel.renameWorksheet':
                return this.renameWorksheet(request.input);
            case 'excel.setActiveWorksheet':
                return this.setActiveWorksheet(request.input);
            case 'excel.insertColumnsBefore':
                return this.insertColumnsBefore(request.input);
            case 'excel.insertColumnsAfter':
                return this.insertColumnsAfter(request.input);
            case 'excel.deleteWorksheet':
                return this.deleteWorksheet(request.input);
            case 'excel.worksheetExists':
                return this.isWorksheetPresent(request.input);
            case 'excel.deleteColumns':
                return this.deleteColumns(request.input);
            case 'excel.insertRowsBefore':
                this.isApplicationOpen();
                return this.insertRowsBefore(request.input);
            case 'excel.insertRowsAfter':
                this.isApplicationOpen();
                return this.insertRowsAfter(request.input);
            case 'excel.save':
                return this.save(request.input);
            case 'excel.close':
                return this.close();
            default:
                throw new Error('Action not found');
        }
    }

    async tearDown() {
        await this.close();
    }

    /**
     * @description Function throws an error if there is no active Excel session (application is not open)
     */
    private isApplicationOpen() {
        if (!this.session) {
            throw new Error('There is no active Excel session. Open application before');
        }
    }

    /**
     * @description Function throws an error if the Excel worksheet exists
     * and we expect it does not exist, or if it does not exist and we expect it to exist.
     */
    private checkIsWorksheetNameCorrect(worksheet: string, shouldExist: boolean): void {
        if (
            (shouldExist && !this.checkIfWorksheetExist(worksheet)) ||
            (
                !shouldExist &&
                (
                    this.checkIfWorksheetExist(worksheet) ||
                    worksheet.length > 31 ||
                    !worksheet.match(RegexPatterns.EXCEL_WORKSHEET_NAME)
                )
            )
        ) {
            throw new Error(ExcelErrorMessage.worksheetIncorrectInput(shouldExist));
        }
    }

    /**
     * @description Divides cell coordinates into row and column coordinates, and converts column name to column number
     * @param cell - cell coordinates, e.g. AZ283
     * @returns separated row and column coordinates of the cell
     * @throws Error if cell coordinates are incorrect
     * @example getDividedCellCoordinates('C25') // { column: 3, row: 25 }
     */
    private getDividedCellCoordinates(cell: string): CellCoordinates {
        const cellMatch = cell.match(/([A-Z]+)([0-9]+)/);
        if (!cellMatch || cellMatch.length !== 3) throw new Error(ExcelErrorMessage.divideCellCoordinatesIncorrectInput());

        return {
            column: this.getColumnCoordinate(cellMatch[1]),
            row: Number(cellMatch[2])
        };
    }

    /**
     * @description Converts column name to column number
     * @param column - column name, e.g. AZ
     * @returns column number
     * @example getColumnCoordinate('C') // 3
     */
    private getColumnCoordinate(column: string): number {
        if (!column || typeof column === "number") throw new Error(ExcelErrorMessage.getColumnCoordinateIncorrectInput());
        return this.session.ActiveSheet.Range(`${column}1`).Column;
    }

    /**
     * @description Sorts columns by their length and alphabetically
     * @param columns - array of column names, e.g. ['A', 'AZ', 'B', 'C']
     * @returns sorted array of column names
     * @example sortColumns(['A', 'AZ', 'B', 'C']) // ['A', 'B', 'C', 'AZ']
     */
    private sortColumns(columns: string[]): string[] {
        return columns.sort((a, b) => {
            if (a.length !== b.length) {
                return a.length - b.length;
            }
            return a.localeCompare(b);
        });
    }

    /**
     * @description Checks if worksheet exists in the Excel session
     * @param worksheet - worksheet name
     * @returns true if worksheet exists, false otherwise
     * @example checkIfWorksheetExist('Sheet1') // true
     */
    private checkIfWorksheetExist(worksheet: string): boolean {
        const worksheets = this.session.Worksheets;
        const worksheetUpper = worksheet.toUpperCase();
        for (let i = 1; i <= worksheets.Count; i++) {
            const sheet = worksheets(i);
            if (sheet.Name.toUpperCase() === worksheetUpper) {
                return true;
            }
        }
        return false;
    }

    /**
     * @description Parses value to array if it's string
     * @param value - Raw or stringified Excel list of lists
     * @param errorMessage - error message to throw if parsing fails
     * @returns list of lists as Excel structure array
     * @throws Error if parsing fails
     * @example parseExcelStructureArray("[["A1", "B1", "C1"], ["A2", "B2", "C2"]]") // [["A1", "B1", "C1"], ["A2", "B2", "C2"]]
     */
    private parseExcelStructureArray(value: string | ExcelCellContent[][], errorMessage: string): ExcelCellContent[][] {
        try {
            return Array.isArray(value) ? value : JSON.parse(value);
        } catch (e) {
            throw new Error(errorMessage);
        }
    }

    /**
     * @description Parses value to array if it's string
     * @param value - Raw or stringified list of cell coordinates
     * @returns array of cell coordinates or input value if parsing fails
     * @example parseOneDimensionalArray("[["A1", "B1", "C1"], ["A2", "B2", "C2"]]") // [["A1", "B1", "C1"], ["A2", "B2", "C2"]]
     * @example parseOneDimensionalArray("A1") // "A1"
     * @example parseOneDimensionalArray("A1:C5") // "A1:C5"
     */
    private parseOneDimensionalArray = (value: string | string[]): string | string[] => {
        try {
            return Array.isArray(value) ? value : JSON.parse(value);
        } catch (e) {
            return value;
        }
    }
}
