import { Injectable } from '@nestjs/common';

@Injectable()
export default class ExcelErrorLogger {
    constructor() { }

    static columnCoordinateIncorrectInput(e?: Error): void {
        throw new Error(`
            ${this.getDisclaimer(e)}
            Row must be a number (e.g. 5).
            Check the Input tab above.
        `);
    }

    static cellCoordinatesIncorrectInput(e?: Error): void {
        throw new Error(`
            ${this.getDisclaimer(e)}
            Start row must be a number (e.g. 5).
            Start column must be a string (e.g. A).
            Check startRow and startColumn in Input tab above.
        `);
    }

    static setCellsIncorrectInput(e?: Error): void {
        throw new Error(`
            ${this.getDisclaimer(e)}
            Input must be an Array (e.g. [["C3", "D3", "E3"], ["C4", "D4", "E4"]]).
            Check targetExcelStructure in Input tab above.
            Try to pass it as variable (e.g. #{myArray}).
        `);
    }

    static noPreviousWorksheet(e?: Error): void {
        throw new Error(`
            ${this.getDisclaimer(e)}
            There is no previous worksheet.
        `);
    }

    private static getDisclaimer(e?: Error): string {
        return `
                ${e ?? ''}
                Common (related to action, not error) solutions:
            `
    }
}
