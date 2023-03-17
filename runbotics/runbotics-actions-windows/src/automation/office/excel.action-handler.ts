import { Injectable } from "@nestjs/common";
import { DesktopRunRequest, StatefulActionHandler } from "runbotics-sdk";

export type ExcelActionRequest =
| DesktopRunRequest<"excel.open", ExcelOpenActionInput>
| DesktopRunRequest<"excel.getSingleCell", ExcelGetSingleCellActionInput>
| DesktopRunRequest<"excel.close", ExcelCloseActionInput>
| DesktopRunRequest<"excel.writeSingleCell", ExcelWriteSingleCellActionInput>;

export type ExcelOpenActionInput = {
    filePath: string;
    sheetName?: string;
    mode?: "xlReadOnly" | "xlReadWrite";
};

export type ExcelCloseActionInput = {
    save: boolean;
};

export type ExcelGetSingleCellActionInput = {
    row: number;
    column: number;
};
export type ExcelGetSingleCellActionOutput = string;

export type ExcelOpenActionOutput = {};

export type ExcelWriteSingleCellActionInput = {
    row: number;
    column: number;
    value: any;
};
export type ExcelWriteSingleCellActionOutput = void;

@Injectable()
export default class ExcelActionHandler extends StatefulActionHandler {
    private session = null;

    constructor() {
        super();
    }

    async open(input: ExcelOpenActionInput): Promise<ExcelOpenActionOutput> {
        const winax = await import('winax');
        this.session = new winax.Object("Excel.Application", { activate: true });

        this.session.Workbooks.Open(input.filePath);
        this.session.Application.Visible = true;
        if (input.sheetName) {
            this.session.Worksheets(input.sheetName).Activate();
        }

        // if (input.mode) {
        //     excel.ActiveWorkbook.ChangeFileAccess(input.mode);
        // }
        return {};
    }

    async close(): Promise<any> {
        this.session?.Quit();
        this.session = null;
    }

    async getSingleCell(
        input: ExcelGetSingleCellActionInput
    ): Promise<ExcelGetSingleCellActionOutput> {
        this.isApplicationOpen();
        const result = this.session.ActiveSheet.Cells(
            Number(input.row),
            Number(input.column)
        );
        return result.__value;
    }

    async writeSingleCell(
        input: ExcelWriteSingleCellActionInput
    ): Promise<ExcelWriteSingleCellActionOutput> {
        this.isApplicationOpen();
        const result = this.session.ActiveSheet.Cells(
            Number(input.row),
            Number(input.column)
        );
        result.Value = input.value;
        return;
    }

    private isApplicationOpen() {
        if (!this.session) {
            throw new Error('Use open application action before');
        }
    }

    run(request: ExcelActionRequest) {
        if (process.platform !== 'win32') {
            throw new Error('Excel actions can be run only on Windows bot');
        }

        switch (request.script) {
            case "excel.open":
                return this.open(request.input);
            case "excel.getSingleCell":
                return this.getSingleCell(request.input);
            case "excel.writeSingleCell":
                return this.writeSingleCell(request.input);
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
