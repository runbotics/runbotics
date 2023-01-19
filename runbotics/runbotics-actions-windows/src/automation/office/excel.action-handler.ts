import { Injectable } from "@nestjs/common";
import * as winax from "winax";
import { DesktopRunRequest, StatelessActionHandler } from "runbotics-sdk";

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
export default class ExcelActionHandler extends StatelessActionHandler {
    constructor() {
        super();
    }

    async open(input: ExcelOpenActionInput): Promise<ExcelOpenActionOutput> {
        const excel = new winax.Object("Excel.Application", { activate: true });

        excel.Workbooks.Open(input.filePath);
        excel.Application.Visible = true;
        if (input.sheetName) {
            excel.Worksheets(input.sheetName).Activate();
        }

        // if (input.mode) {
        //     excel.ActiveWorkbook.ChangeFileAccess(input.mode);
        // }
        return {};
    }

    async close(input: ExcelCloseActionInput): Promise<any> {
        const excel = new winax.Object("Excel.Application", { activate: true });
        excel.Quit();
    }

    async getSingleCell(
        input: ExcelGetSingleCellActionInput
    ): Promise<ExcelGetSingleCellActionOutput> {
        const excel = new winax.Object("Excel.Application", { activate: true });

        const result = excel.ActiveSheet.Cells(
            Number(input.row),
            Number(input.column)
        );
        return result.__value;
    }

    async writeSingleCell(
        input: ExcelWriteSingleCellActionInput
    ): Promise<ExcelWriteSingleCellActionOutput> {
        const excel = new winax.Object("Excel.Application", { activate: true });

        const result = excel.ActiveSheet.Cells(
            Number(input.row),
            Number(input.column)
        );
        result.Value = input.value;
        return;
    }

    run(request: ExcelActionRequest) {
        switch (request.script) {
            case "excel.open":
                return this.open(request.input);
            case "excel.getSingleCell":
                return this.getSingleCell(request.input);
            case "excel.writeSingleCell":
                return this.writeSingleCell(request.input);
            case "excel.close":
                return this.close(request.input);
            default:
                throw new Error("Action not found");
        }
    }
}
