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

    static getColumnsIncorrectInput(): string {
        return `
            Start column has to be capital letter from range [A-Z].
            End column is optional, but if provided it has to be capital letter from range [A-Z].
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
