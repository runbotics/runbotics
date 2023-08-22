import { Injectable } from '@nestjs/common';

@Injectable()
export default class ExcelErrorMessage {
    constructor() { }

    /* Incorrect action input */

    static getCellIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Target cell must be a string (e.g. "A1").
            Check targetCell in the Input tab above.
        `
    }

    static setCellIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Target cell must be a string (e.g. "A1").
            Value must be a number, boolean, string (incl. variable) (e.g. 150, true, "myValue", "#{myVariable}").
            Check Input tab above.
        `
    }

    static getCellsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Start cell and end cell must be a string (e.g. "D5").
            ${this.getTip()}
        `
    }

    static setCellsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Values must be an Array of numbers, booleans or strings (e.g. [["C3", "D3", "E3"], ["C4", "D4", "E4"]]).
            ${this.getTip()}
            Try to pass it as variable (e.g. #{myArray}).
        `
    }

    static clearCellsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Input must be range or Array (e.g. "A1:C3" or ["A1", "B2", "E5"]).
            ${this.getTip()}
            Try to pass it as variable (e.g. #{myArray}).
        `;
    }

    static deleteColumnsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Input must be range or Array (e.g. "A", "F:J" or ["A", "B", "C"]).
            ${this.getTip()}
            Try to pass it as variable (e.g. #{myArray}).
        `;
    }

    static createWorksheetIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Worksheet name is incorrect or already taken.
            ${this.getTip()}
        `
    }

    static insertColumnsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Column has to be a column letter or number, e.g. "C".
            Amount has to be a whole positive number, eg. 5.
            ${this.getTip()}
            `
    }

    static insertRowsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Row has to be a whole positive number (e.g. 5).
            Number has to be a whole positive number (e.g. 5).
            ${this.getTip()}
        `
    }

    /* Incorrect utils input */

    static divideCellCoordinatesIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
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

    static getColumnCoordinateIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Column must be a string (e.g. "A").
            ${this.getTip()}
        `
    }

    /* Other */

    private static getDisclaimer(e?: Error): string {
        return `
                ${e ?? ''}

                Common solutions:
        `
    }

    private static getTip(): string {
        return `
            Check the input tab above.
        `
    }
}
