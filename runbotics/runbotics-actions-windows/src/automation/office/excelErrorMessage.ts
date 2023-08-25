import { Injectable } from '@nestjs/common';

@Injectable()
export default class ExcelErrorMessage {
    constructor() { }

    /* Incorrect action input */

    static getCellIncorrectInput(): string {
        return `
            Target cell must be a string (e.g. "A1").
            ${this.getCheckInputTip()}
        `
    }

    static deleteRowsIncorrectInput(): string {
        return `Row must be a number (e.g. 5), range (e.g. 1:3) or array (e.g. [1,4])`
    }

    static setCellIncorrectInput(): string {

        return `
            Target cell must be a string (e.g. "A1").
            Value must be a number, boolean or string (e.g. 150, true, "myValue", "#{myVariable}").
            ${this.getCheckInputTip()}
        `
    }

    static getCellsIncorrectInput(): string {
        return `
            Start cell and end cell must be a string (e.g. "D5").
            ${this.getCheckInputTip()}
        `
    }

    static setCellsIncorrectInput(): string {
        return `
            Values must be an Array of numbers, booleans and/or strings (and nulls if intention is to not overwrite cell) (e.g. [["C3", "D3", "E3"], ["C4", "D4", "E4"]]).
            ${this.getCheckInputTip()}
        `
    }

    static clearCellsIncorrectInput(): string {
        return `
            Input must be range or Array (e.g. "A1:C3" or ["A1", "B2", "E5"]).
            ${this.getCheckInputTip()}
        `;
    }

    static deleteColumnsIncorrectInput(): string {
        return `
            Input must be range or Array (e.g. "A", "F:J" or ["A", "B", "C"]).
            ${this.getCheckInputTip()}
        `;
    }

    static createWorksheetIncorrectInput(): string {
        return `
            Worksheet name is incorrect or already taken.
            ${this.getCheckInputTip()}
        `
    }

    static insertColumnsIncorrectInput(): string {
        return `
            Column has to be a column letter (e.g. "C").
            Amount has to be a number (eg. 5).
            ${this.getCheckInputTip()}
            `
    }

    static insertRowsIncorrectInput(): string {
        return `
            Row has to be a number (e.g. 5).
            Number has to be a number (e.g. 5).
            ${this.getCheckInputTip()}
        `
    }

    /* Incorrect utils input */

    static divideCellCoordinatesIncorrectInput(): string {
        return `
            Start/End cell must be a string (e.g. "A1").
            ${this.getCheckInputTip()}
        `
    }

    static worksheetIncorrectInput(shouldExist: boolean): string {
        return (
            shouldExist
                ? `Worksheet doesn't exist.`
                : `Worksheet name is already taken.`
        )
            + this.getCheckInputTip();
    }

    static worksheetNameDoesNotExistIncorrectInput(): string {
        return `
            Worksheet name doesn't exist.
            ${this.getCheckInputTip()}
        `;
    }


    static getColumnCoordinateIncorrectInput(): string {
        return `
            Column must be a string (e.g. "A").
            ${this.getCheckInputTip()}
        `
    }

    static tableNotFoundIncorrectInput(): string {
        return `
            Table of this name not found.
            ${this.getCheckInputTip()}
        `;
    }

    /* Tips */

    private static getCheckInputTip(): string {
        return `
            Check the input tab above.
        `
    }
}
