import { Injectable } from '@nestjs/common';

@Injectable()
export default class ExcelErrorLogger {
    constructor() { }

    static startCellCoordinates(e?: Error): void {
        throw new Error(`
            Start row must be a number (e.g. 5).
            Start column must be a string (e.g. A).
            Check startRow and startColumn in Input tab above.
            ${e}
        `);
    }

    static setCellIncorrectStructure(e?: Error): void {
        throw new Error(`
            Input must be an Array (e.g. [["C3", "D3", "E3"], ["C4", "D4", "E4"]]).
            Check targetExcelStructure in Input tab above.
            Try to pass it as variable (e.g. #{myArray}).
            ${e}
        `);
    }
}
