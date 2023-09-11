import { Injectable } from '@nestjs/common';

@Injectable()
export default class SharePointExcelErrorMessage {
    constructor() {}

    /* Incorrect action input */
    static getCellIncorrectInput(): string {
        return `
            Cell address has to include column letter name and row number (e.g. 'B2').
            ${this.getCheckInputTip()}
        `;
    }

    static getCellsIncorrectInput(): string {
        return `
            Start cell addresses has to include a column letter and a row number (e.g. A1).
            End cell addresses has to include a column letter and a row number (e.g. H5).
            ${this.getCheckInputTip()}
        `;
    }
    
    /* Tips */

    private static getCheckInputTip(): string {
        return `
            Check the input tab above.
        `;
    }
}