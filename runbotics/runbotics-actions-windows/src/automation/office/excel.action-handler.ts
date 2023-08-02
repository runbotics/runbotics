import { Injectable } from "@nestjs/common";
import { DesktopRunRequest, StatefulActionHandler } from "runbotics-sdk";
import { threadId } from "worker_threads";
import ExcelErrorLogger from "./excelError.logger";

type ExcelObjectStructure = Record<string, unknown>
type ExcelArrayStructure = unknown[][]

export type ExcelActionRequest =
    | DesktopRunRequest<"excel.open", ExcelOpenActionInput>
    | DesktopRunRequest<"excel.getCell", ExcelGetCellActionInput>
    | DesktopRunRequest<"excel.close">
    | DesktopRunRequest<"excel.save">
    | DesktopRunRequest<"excel.setCell", ExcelSetCellActionInput>
    | DesktopRunRequest<"excel.setCells", ExcelSetCellsActionInput>;

export type ExcelOpenActionInput = {
    path: string;
    worksheet?: string;
    mode?: "xlReadOnly" | "xlReadWrite";
};

export type ExcelGetCellActionInput = {
    row: number;
    column: string;
    worksheet?: string;
};

export interface ExcelSaveActionInput {
    fileName: string;
}

export type ExcelSetCellActionInput = {
    row: number;
    column: string;
    value: unknown;
    worksheet?: string;
};

export type ExcelSetCellsActionInput = {
    startRow: number;
    startColumn: string;
    targetExcelStructure: ExcelObjectStructure | ExcelArrayStructure;
    worksheet?: string;
};

@Injectable()
export default class ExcelActionHandler extends StatefulActionHandler {
    private session = null;
    private readonly excelErrorLogger: ExcelErrorLogger;

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
        const optionalWorksheet = input?.worksheet;

        return optionalWorksheet
            ? this.session
                .Worksheets(optionalWorksheet)
                .Range(`${input.column}${input.row}`)
                .Value()
            : this.session.ActiveSheet
                .Range(`${input.column}${input.row}`)
                .Value();
    }

    async setCell(
        input: ExcelSetCellActionInput
    ): Promise<void> {
        const optionalWorksheet = input?.worksheet;

        const cell = optionalWorksheet
            ? this.session
                .Worksheets(optionalWorksheet)
                .Range(`${input.column}${input.row}`)
            : this.session.ActiveSheet
                .Range(`${input.column}${input.row}`)

        cell.Value = input.value;
    }

    async setCells(
        input: ExcelSetCellsActionInput
    ): Promise<void> {
        const { worksheet: optionalWorksheet, targetExcelStructure } = input;
        const openedWorksheet = this.session.ActiveSheet.name;
        const isObject = this.checkIsObject(targetExcelStructure), isArray = this.checkIsArray(targetExcelStructure);

        if (optionalWorksheet) this.session.Worksheets(optionalWorksheet).Activate();

        if (isArray) this.setCellArrayValues(targetExcelStructure as ExcelArrayStructure, input?.startColumn, input?.startRow);
        else if (isObject) this.setCellObjectValues(targetExcelStructure as ExcelObjectStructure);
        else this.excelErrorLogger.setCellIncorrectStructure();

        if (optionalWorksheet) this.session.Worksheets(openedWorksheet).Activate();
    }

    private isApplicationOpen() {
        if (!this.session) {
            throw new Error('There is no active Excel session. Open application before');
        }
    }

    private checkIsObject(value: unknown): boolean {
        return typeof value === 'object';
    }

    private checkIsArray(value: unknown): boolean {
        return Array.isArray(value);
    }

    private setCellObjectValues(targetExcelStructure: ExcelObjectStructure) {
        for (const [coordinate, cellValue] of Object.entries(targetExcelStructure)) {
            const cell = this.session.ActiveSheet.Range(coordinate);
            cell.Value = cellValue;
        }
    }

    private setCellArrayValues(targetExcelStructure: ExcelArrayStructure, startColumn: string, startRow: number): void {
        let currentColumn = startColumn, currentRow = startRow;
        if (Array.isArray(targetExcelStructure)) {
            for (const row of targetExcelStructure) {
                for (const cellValue of row) {
                    const cellToSet = this.session.ActiveSheet.Range(`${currentColumn}${currentRow}`);
                    cellToSet.Value = cellValue;
                    currentColumn = this.getNextColumn(currentColumn);
                }
                currentRow++;
                currentColumn = startColumn;
            }
        }
    }

    private getNextColumn(currentColumn: string): string {
        return String.fromCharCode(currentColumn.charCodeAt(0) + 1)
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
}
