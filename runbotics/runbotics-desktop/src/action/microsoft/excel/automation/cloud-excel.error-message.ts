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
            Start cell addresses has to include a column letter and a row number (e.g. A1).
            Values has to be in a format of array of rows, where each row is an array of values to set, (e.g. [["value A3", "value B3"],["value A4", "value B4"]]).
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
