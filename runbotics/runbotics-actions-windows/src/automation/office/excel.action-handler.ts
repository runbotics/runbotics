import { Injectable } from "@nestjs/common";
import { StatefulActionHandler } from "runbotics-sdk";
import ExcelErrorLogger from "./excelError.logger";
import {
    ExcelActionRequest,
    ExcelGetCellActionInput,
    ExcelOpenActionInput,
    ExcelSaveActionInput,
    ExcelSetCellActionInput,
    ExcelSetCellsActionInput,
    StartCellCoordinates,
    ExcelInsertColumnsInput
} from "./excel.types";
import { ExcelUtils } from "./excel.utils";

@Injectable()
export default class ExcelActionHandler extends StatefulActionHandler {
    private session = null;
    private previousWorksheet = null;

    constructor() {
        super();
        this.getSession = this.getSession.bind(this);
        this.setSession = this.setSession.bind(this);
        this.getPrevWorksheet = this.getPrevWorksheet.bind(this);
        this.setPrevWorksheet = this.setPrevWorksheet.bind(this);
    }

    async open(input: ExcelOpenActionInput): Promise<void> {
        const winax = await import("winax");
        this.session = new winax.Object("Excel.Application", {
            activate: true,
        });

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
            : this.session.ActiveSheet.Range(
                  `${input.column}${input.row}`
              ).Value();
    }

    async setCell(input: ExcelSetCellActionInput): Promise<void> {
        const optionalWorksheet = input?.worksheet;

        const cell = optionalWorksheet
            ? this.session
                  .Worksheets(optionalWorksheet)
                  .Range(`${input.column}${input.row}`)
            : this.session.ActiveSheet.Range(`${input.column}${input.row}`);

        cell.Value = input.value;
    }

    async setCells(
        input: ExcelSetCellsActionInput
    ): Promise<void> {
        await this.switchWorksheet(input?.worksheet);
        const session = this.getSession();
        const { startRow, startColumn } = await this.getStartCellCoordinates(input?.startColumn, Number(input?.startRow));
        for (const row of input.cellValues) {
            for (const cellValue of row) {
                try {
                    const cell =
                        session.ActiveSheet
                            .Cells(
                                startRow + input.cellValues.indexOf(row),
                                startColumn + row.indexOf(cellValue)
                            );
                    if (cellValue) cell.Value = cellValue;
                } catch (e) {
                    ExcelErrorLogger.setCellIncorrectStructure(e);
                }
            }
        }
        this.switchPrevWorksheet();
    }

    async insertColumnsBefore(input: ExcelInsertColumnsInput): Promise<void> {
        await this.switchWorksheet(input?.worksheet);
        const session = this.getSession();
        const column = await ExcelUtils.getColumnCoordinate(session, input.column);
        const amount = input?.amount && input?.amount > 1 ? input.amount : 1;

        for (let i = 0; i < amount; i++) {
            session.Columns(column).Insert();
        }

        this.switchPrevWorksheet();
    }

    private isApplicationOpen() {
        if (!this.session) {
            throw new Error(
                "There is no active Excel session. Open application before"
            );
        }
    }

    run(request: ExcelActionRequest) {
        if (process.platform !== "win32") {
            throw new Error("Excel actions can be run only on Windows bot");
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
            case "excel.insertColumnsBefore":
                this.isApplicationOpen();
                return this.insertColumnsBefore(request.input);
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

    getSession() {
        return this.session;
    }

    setSession(session) {
        this.session = session;
    }

    getPrevWorksheet(): string | null {
        return this.previousWorksheet;
    }

    setPrevWorksheet(worksheet: string | null) {
        this.previousWorksheet = worksheet;
    }

    private switchWorksheet(worksheet?: string): void {
        ExcelUtils.switchWorksheet(this.getSession, this.setSession, this.setPrevWorksheet, worksheet);
    }

    private switchPrevWorksheet(): void {
        ExcelUtils.switchPrevWorksheet(this.getSession, this.setSession, this.setPrevWorksheet, this.getPrevWorksheet());
    }

    private getStartCellCoordinates(startColumn?: string, startRow?: number): StartCellCoordinates {
        return ExcelUtils.getStartCellCoordinates(this.getSession, startColumn, startRow);
    }
}
