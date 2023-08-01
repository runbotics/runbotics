import { Injectable } from "@nestjs/common";
import { DesktopRunRequest, StatefulActionHandler } from "runbotics-sdk";

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
    column: number;
    value: unknown;
    worksheet?: string;
};

export type ExcelSetCellsActionInput = {
    targetExcelStructure: Record<string, unknown>;
    worksheet?: string;
};

@Injectable()
export default class ExcelActionHandler extends StatefulActionHandler {
    private session = null;

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
    ): Promise<string | number> {
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
        this.checkIsObject(input.targetExcelStructure);

        const optionalWorksheet = input?.worksheet;
        const openedWorksheet = this.session.ActiveSheet.name;

        if (optionalWorksheet) this.session.Worksheets(optionalWorksheet).Activate();
        for (const [coordinate, cellValue] of Object.entries(input.targetExcelStructure)) {
            const cell = this.session.ActiveSheet.Range(coordinate);
            cell.Value = cellValue;
        }
        if (optionalWorksheet) this.session.Worksheets(openedWorksheet).Activate();
    }

    private isApplicationOpen() {
        if (!this.session) {
            throw new Error('There is no active Excel session. Open application before');
        }
    }

    private checkIsObject(value: unknown): void {
        if (typeof value !== 'object') {
            throw new Error('Target Excel structure must be variable of a JSON object e.g. { "A1": "value", "B3": "another value" }. Check targetExcelStructure in Input tab above.');
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
