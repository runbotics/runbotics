export class CloudExcelErrorMessage {
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

    static setCellsIncorrectInput(): string {
        return `
            Start cell field expects cell address (e.g. A1).
            Values field expects specified nested lists. Each list represents a row and the elements inside the values in the corresponding column, e.g. [["A3 value", "B3 value"], ["A4 value", "B4 value"]])
            To skip a cell use null.
            To clear a cell use "".
            For single cell update use setCell action.
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
