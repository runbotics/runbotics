import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import * as winax from "winax";
import { DesktopRunRequest } from "runbotics-sdk";
import { StatefulActionHandler } from "runbotics-sdk";
import { StatelessActionHandler } from "runbotics-sdk";
import { DesktopRunResponse } from "runbotics-sdk";

export type ExcelActionRequest<I> = DesktopRunRequest<any> & {
    script:
        | "excel.open"
        | "excel.getSingleCell"
        | "excel.close"
        | "excel.writeSingleCell";
};

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
class ExcelAutomation extends StatelessActionHandler {
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

    async run(
        request: DesktopRunRequest<any>
    ): Promise<DesktopRunResponse<any>> {
        const excelAction: ExcelActionRequest<any> =
            request as ExcelActionRequest<any>;
        let output: any = {};
        switch (excelAction.script) {
            case "excel.open":
                output = await this.open(excelAction.input);
                break;
            case "excel.getSingleCell":
                output = await this.getSingleCell(excelAction.input);
                break;
            case "excel.writeSingleCell":
                output = await this.writeSingleCell(excelAction.input);
                break;
            case "excel.close":
                output = await this.close(excelAction.input);
                break;
            default:
                throw new Error("Action not found");
        }

        return {
            status: "ok",
            output: output,
        };
    }
}

export default ExcelAutomation;
