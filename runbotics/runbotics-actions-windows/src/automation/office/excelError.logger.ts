import { Injectable } from '@nestjs/common';

@Injectable()
export default class ExcelErrorLogger {
    constructor() { }

    setCellIncorrectStructure(): void {
        throw new Error('Input must be variable of an Array or JSON object (e.g. [["C3", "D3", "E3"], ["C4", "D4", "E4"]], { "A1": "value", "B3": "another value" }). Check targetExcelStructure in Input tab above.');
    }
}
