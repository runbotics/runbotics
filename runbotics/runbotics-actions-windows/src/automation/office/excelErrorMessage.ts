import { Injectable } from '@nestjs/common';

@Injectable()
export default class ExcelErrorMessage {
    constructor() { }

    /* Incorrect action input */

    static getCellIncorrectInput(): string {
        return `
            Target cell must be a string (e.g. "A1").
            Check targetCell in the Input tab above.
        `
    }

    static setCellIncorrectInput(): string {
        return `
            Target cell must be a string (e.g. "A1").
            Value must be a number, boolean, string (incl. variable) (e.g. 150, true, "myValue", "#{myVariable}").
            Check Input tab above.
        `
    }

    static getCellsIncorrectInput(): string {
        return `
            Start cell and end cell must be a string (e.g. "D5").
            ${this.getTip()}
        `
    }

    static setCellsIncorrectInput(): string {
        return `
            Values must be an Array of numbers, booleans or strings (e.g. [["C3", "D3", "E3"], ["C4", "D4", "E4"]]).
            ${this.getTip()}
            Try to pass it as variable (e.g. #{myArray}).
        `
    }

    static clearCellsIncorrectInput(): string {
        return `
            Input must be range or Array (e.g. "A1:C3" or ["A1", "B2", "E5"]).
            ${this.getTip()}
            Try to pass it as variable (e.g. #{myArray}).
        `;
    }

    static deleteColumnsIncorrectInput(): string {
        return `
            Input must be range or Array (e.g. "A", "F:J" or ["A", "B", "C"]).
            ${this.getTip()}
            Try to pass it as variable (e.g. #{myArray}).
        `;
    }

    static createWorksheetIncorrectInput(): string {
        return `
            Worksheet name is incorrect or already taken.
            ${this.getTip()}
        `
    }

    static insertColumnsIncorrectInput(): string {
        return `
            Column has to be a column letter or number, e.g. "C".
            Amount has to be a whole positive number, eg. 5.
            ${this.getTip()}
            `
    }

    static insertRowsIncorrectInput(): string {
        return `
            Row has to be a whole positive number (e.g. 5).
            Number has to be a whole positive number (e.g. 5).
            ${this.getTip()}
        `
    }

    /* Incorrect utils input */

    static divideCellCoordinatesIncorrectInput(): string {
        return `
            Start/End cell must be a string (e.g. "A1").
            ${this.getTip()}
        `
    }

    static worksheetIncorrectInput(shouldExist: boolean): string {
        return (
            shouldExist
                ? `Worksheet doesn't exist.`
                : `Worksheet name is already taken.`
        )
            + this.getTip();
    }

    static worksheetNameDoesNotExistIncorrectInput(): string {
        return `
            Worksheet name doesn't exist.
            ${this.getTip()}
        `;
    }


    static getColumnCoordinateIncorrectInput(): string {
        return `
            Column must be a string (e.g. "A").
            ${this.getTip()}
        `
    }

    /* Other */

    private static getTip(): string {
        return `
            Check the input tab above.
        `
    }
}
