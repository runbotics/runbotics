import { StartCellCoordinates } from "./excel.types";
import ExcelErrorLogger from "./excelError.logger";

export class ExcelUtils {
    static switchWorksheet(getSession: () => any, setSession: (session: any) => void, setPrevWorksheet: (worksheet?: string) => void, worksheet?: string): void {
        const session = getSession();
        if (!session) return;
        if (!worksheet || worksheet === session.ActiveSheet.Name) return;

        setPrevWorksheet(session.ActiveSheet.Name);
        session.Worksheets(worksheet).Activate();
        setSession(session);
    }

    static switchPrevWorksheet(getSession: () => any, setSession: (session: any) => void, setPrevWorksheet: (worksheet: string | null) => void, prevWorksheet: string | null): void {
        if (!prevWorksheet) return;
        const session = getSession();
        session.Worksheets(prevWorksheet).Activate();
        setPrevWorksheet(null);
        setSession(session);
    }

    static getStartCellCoordinates(getSession: () => any, startColumn?: string, startRow?: number): StartCellCoordinates {
        if (!startColumn && !startRow) return { startColumn: 1, startRow: 1 };
        if (!startColumn) return { startColumn: 1, startRow: startRow };
        const session = getSession();
        try {
            const columnNumber = session.ActiveSheet.Range(`${startColumn}1`).Column;
            return {
                startColumn: columnNumber,
                startRow: startRow ?? 1
            };
        } catch (e) {
            ExcelErrorLogger.startCellCoordinates();
        }
    }
}