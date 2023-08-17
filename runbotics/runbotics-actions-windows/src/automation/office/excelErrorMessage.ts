import { Injectable } from '@nestjs/common';

@Injectable()
export default class ExcelErrorMessage {
    constructor() { }

    /* Incorrect input */

    static columnCoordinateIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Row must be a number (e.g. 5).
            Check the Input tab above.
        `
    }

    static cellCoordinatesIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Start row must be a number (e.g. 5).
            Start column must be a string or number (e.g. A or 1).
            Check startRow and startColumn in the Input tab above.
        `
    }

    static setCellsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Input must be an Array (e.g. [["C3", "D3", "E3"], ["C4", "D4", "E4"]]).
            Check the Input tab above.
            Try to pass it as variable (e.g. #{myArray}).
        `
    }

    static getCellsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Start row and end row must be a number (e.g. 5).
            Start column and end column must be a string or number (e.g. A or 1).
            Check the Input tab above.
        `
    }

    static noPreviousWorksheet(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Input must be range or Array (e.g. "D", "C:E" or ["C", "D", "E"]).
            Check columnRange in Input tab above.
            Try to pass it as variable (e.g. #{myArray}).
        `;
    }

    static clearCellsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Input must be range or Array (e.g. "A1:C3" or ["A1", "B2", "E5"]).
            Check targetCells in Input tab above.
            Try to pass it as variable (e.g. #{myArray}).
        `;
    }

    static deleteColumnsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Input must be range or Array (e.g. "A", "F:J" or ["A", "B", "C"]).
            Check columnRange in Input tab above.
            Try to pass it as variable (e.g. #{myArray}).
        `;
    }

    static worksheetIncorrectInput(shouldExist: boolean): string {
        return shouldExist
            ? "Worksheet doesn't exist."
            : "Worksheet name incorrect or already taken."
        ;
    }

    static insertColumnsIncorrectInput(e?: Error): string {
        return `
            ${this.getDisclaimer(e)}
            Column has to be a column letter or number, e.g. "C" or 3.
            Amount has to be a whole positive number, eg. 5.
        `
    }

    /* Other */
    private static getDisclaimer(e?: Error): string {
        return `
                ${e ?? ''}
                Common (related to action, not error) solutions:
            `
    }
}
