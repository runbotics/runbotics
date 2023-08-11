import { Injectable } from "@nestjs/common";
import { StatefulActionHandler } from "runbotics-sdk";
import ExcelErrorMessage from "./excelErrorMessage";
import {
    ExcelActionRequest,
    ExcelGetCellActionInput,
    ExcelOpenActionInput,
    ExcelSaveActionInput,
    ExcelSetCellActionInput,
    ExcelSetCellsActionInput,
    ExcelFindFirstEmptyRowActionInput,
    CellCoordinates,
    GetCellCoordinatesParams,
    ExcelDeleteColumnsActionInput,
    ExcelClearCellsActionInput
} from "./excel.types";

@Injectable()
export default class ExcelActionHandler extends StatefulActionHandler {
    private session = null;
    private previousWorksheet = null;

    constructor() {
        super();
    }

    async open(input: ExcelOpenActionInput): Promise<void> {
        const winax = await import('winax');
        this.session = new winax.Object("Excel.Application", { activate: true });

        this.session.Workbooks.Open(input.path);
        this.session.Visible = true;
        if (input.worksheet) {
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
        if (this.session?.DisplayAlerts) {
            this.session.DisplayAlerts = false;
        }
        this.session?.Quit();
        if (this.session?.DisplayAlerts) {
            this.session.DisplayAlerts = true;
        }
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
        return this.session
            .Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name)
            .Range(`${input.column}${input.row}`)
            .Value()
    }

    async setCell(
        input: ExcelSetCellActionInput
    ): Promise<void> {
        const cell = this.session
            .Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name)
            .Range(`${input.column}${input.row}`)

        cell.Value = input.value;
    }

    async setCells(
        input: ExcelSetCellsActionInput
    ): Promise<void> {
        if (!Array.isArray(input.cellValues)) throw new Error(ExcelErrorMessage.setCellsIncorrectInput());
        const { startRow, startColumn } = this.getCellCoordinates({
            startColumn: input?.startColumn,
            startRow: Number(input?.startRow ?? 1)
        });
        let columnCounter = startColumn,
            rowCounter = startRow;
        const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
        for (const rowValues of input.cellValues) {
            for (const cellValue of rowValues) {
                try {
                    if (cellValue !== null) targetWorksheet.Cells(rowCounter, columnCounter).Value = cellValue;
                    columnCounter++;
                } catch (e) {
                    throw new Error(ExcelErrorMessage.setCellsIncorrectInput(e));
                }
            }
            rowCounter++;
            columnCounter = startColumn;
        }
    }

    async findFirstEmptyRow(
        input: ExcelFindFirstEmptyRowActionInput
    ): Promise<number> {
        const { startColumn, startRow } = this.getCellCoordinates({
            startColumn: input?.startColumn,
            startRow: Number(input?.startRow ?? 1)
        });
        let rowCounter = startRow;
        while (
            this.session
                .Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name)
                .Cells(rowCounter, startColumn)
                .Value()
        ) rowCounter++;
        return rowCounter;
    }

    async deleteColumns(
        input: ExcelDeleteColumnsActionInput
    ): Promise<void> {
        try {
            const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
            if (!Array.isArray(input.columnRange)) targetWorksheet.Columns(input.columnRange).Delete();
            else {
                const sortedColumns = this.sortColumns(input.columnRange);
                sortedColumns.forEach((column, idx) => {
                    const columnCoordinate = this.getColumnCoordinate(column);
                    targetWorksheet.Columns(columnCoordinate - idx).Delete();
                });
            }
        } catch (e) {
            throw new Error(ExcelErrorMessage.deleteColumnsIncorrectInput(e));
        }
    }

    private isApplicationOpen() {
        if (!this.session) {
            throw new Error('There is no active Excel session. Open application before');
        }
    }

    async clearCells(input: ExcelClearCellsActionInput): Promise<void> {
        try {
            const targetWorksheet = this.session.Worksheets(input?.worksheet ?? this.session.ActiveSheet.Name);
            if (!Array.isArray(input.targetCells))
                targetWorksheet
                    .Range(input.targetCells)
                    .Clear();
            else
                for (const cellCoordinate of input.targetCells)
                    targetWorksheet
                        .Range(cellCoordinate)
                        .Clear();
        } catch (e) {
            throw new Error(ExcelErrorMessage.clearCellsIncorrectInput(e));
        }
    }

    run(request: ExcelActionRequest) {
        if (process.platform !== 'win32') {
            throw new Error('Excel actions can be run only on Windows bot');
        }

        switch (request.script) {
            case "excel.open":
                return this.open(request.input);
            case "excel.getCell":
                this.isApplicationOpen();
                return this.getCell(request.input);
            case "excel.setCell":
                this.isApplicationOpen();
                return this.setCell(request.input);
            case "excel.findFirstEmptyRow":
                this.isApplicationOpen();
                return this.findFirstEmptyRow(request.input);
            case "excel.setCells":
                this.isApplicationOpen();
                return this.setCells(request.input);
            case "excel.save":
                this.isApplicationOpen();
                return this.save(request.input);
            case "excel.close":
                return this.close();
            default:
                throw new Error("Action not found");
        }
    }

    async tearDown() {
        await this.close();
    }

    private getCellCoordinates({ startColumn, startRow, endColumn, endRow }: GetCellCoordinatesParams): CellCoordinates {
        try {
            return {
                startColumn: startColumn ? this.getColumnCoordinate(startColumn) : 1,
                startRow: startRow ?? 1,
                endColumn: this.getColumnCoordinate(endColumn),
                endRow: endRow ?? null
            };
        } catch (e) {
            throw new Error(ExcelErrorMessage.cellCoordinatesIncorrectInput(e));
        }
    }

    private getColumnCoordinate(column: string | number): number {
        if (!column) return null;
        const columnNumber = Number(column);
        if (!isNaN(columnNumber)) return columnNumber;
        return this.session.ActiveSheet.Range(`${column}1`).Column;
    }

    private sortColumns(columns: string[]): string[] {
        return columns.sort((a, b) => {
            if (a.length !== b.length) {
                return a.length - b.length;
            }
            return a.localeCompare(b);
        });
    }
}
