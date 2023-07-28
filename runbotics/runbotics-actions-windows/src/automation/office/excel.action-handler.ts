import { Injectable } from "@nestjs/common";
import { DesktopRunRequest, StatefulActionHandler } from "runbotics-sdk";

export type ExcelActionRequest =
| DesktopRunRequest<"excel.open", ExcelOpenActionInput>
| DesktopRunRequest<"excel.getCell", ExcelGetCellActionInput>
| DesktopRunRequest<"excel.close">
| DesktopRunRequest<"excel.save">
| DesktopRunRequest<"excel.setCell", ExcelSetCellActionInput>;
| DesktopRunRequest<"excel.runMacro", ExcelRunMacroInput>;

export type ExcelOpenActionInput = {
    path: string;
    worksheet?: string;
    mode?: "xlReadOnly" | "xlReadWrite";
};

export type ExcelGetCellActionInput = {
    row: number;
    column: string;
};

export interface ExcelSaveActionInput {
    fileName: string;
}

export type ExcelSetCellActionInput = {
    row: number;
    column: number;
    value: any;
};

export type ExcelRunMacroInput = {
    macro: string;
    functionParams: Array<string>;
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
        return this.session.ActiveSheet.Range(`${input.column}${input.row}`).Value();
    }

    async setCell(
        input: ExcelSetCellActionInput
    ): Promise<void> {
        const cell = this.session.ActiveSheet.Range(`${input.column}${input.row}`);
        cell.Value = input.value;
    }

    async runMacro(input: ExcelRunMacroInput) {
        if (input.functionParams.length === 0) {
            return this.session.Run(input.macro);
        } else if (input.functionParams.length === 1) {
            return this.session.Run(input.macro, input.functionParams[0]);
        } else if (input.functionParams.length === 2) {
            return this.session.Run(
                input.macro,
                input.functionParams[0],
                input.functionParams[1],
            );
        } else if (input.functionParams.length === 3) {
            return this.session.Run(
                input.macro,
                input.functionParams[0],
                input.functionParams[1],
                input.functionParams[2],
            );
        } else if (input.functionParams.length === 4) {
            return this.session.Run(
                input.macro,
                input.functionParams[0],
                input.functionParams[1],
                input.functionParams[2],
                input.functionParams[3],
            );
        } else if (input.functionParams.length === 5) {
            return this.session.Run(
                input.macro,
                input.functionParams[0],
                input.functionParams[1],
                input.functionParams[2],
                input.functionParams[3],
                input.functionParams[4],
            );
        } else if (input.functionParams.length === 6) {
            return this.session.Run(
                input.macro,
                input.functionParams[0],
                input.functionParams[1],
                input.functionParams[2],
                input.functionParams[3],
                input.functionParams[4],
                input.functionParams[5],
            );
        } else if (input.functionParams.length === 7) {
            return this.session.Run(
                input.macro,
                input.functionParams[0],
                input.functionParams[1],
                input.functionParams[2],
                input.functionParams[3],
                input.functionParams[4],
                input.functionParams[5],
                input.functionParams[6],
            );
        } else if (input.functionParams.length === 8) {
            return this.session.Run(
                input.macro,
                input.functionParams[0],
                input.functionParams[1],
                input.functionParams[2],
                input.functionParams[3],
                input.functionParams[4],
                input.functionParams[5],
                input.functionParams[6],
                input.functionParams[7],
            );
        } else if (input.functionParams.length === 9) {
            return this.session.Run(
                input.macro,
                input.functionParams[0],
                input.functionParams[1],
                input.functionParams[2],
                input.functionParams[3],
                input.functionParams[4],
                input.functionParams[5],
                input.functionParams[6],
                input.functionParams[7],
                input.functionParams[8],
            );
        } else if (input.functionParams.length === 10) {
            return this.session.Run(
                input.macro,
                input.functionParams[0],
                input.functionParams[1],
                input.functionParams[2],
                input.functionParams[3],
                input.functionParams[4],
                input.functionParams[5],
                input.functionParams[6],
                input.functionParams[7],
                input.functionParams[8],
                input.functionParams[9],
            );
        }
    }

    private isApplicationOpen() {
        if (!this.session) {
            throw new Error('There is no active Excel session. Open application before');
        }
    }

    run(request: ExcelActionRequest) {
        if (request.platform !== 'win32') {
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
