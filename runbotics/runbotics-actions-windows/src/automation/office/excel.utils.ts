export class ExcelUtils {
    static switchWorksheet(getSession: () => any, setSession: (session: any) => void, setPrevWorksheet: (worksheet?: string) => void, worksheet?: string): void {
        const session = getSession();
        if (!session) return;
        if (!worksheet || worksheet === session.ActiveSheet.Name) return;

        session.Worksheets(worksheet).Activate();
        setPrevWorksheet(session.ActiveSheet.Name);
        setSession(session);
    }

    static switchPrevWorksheet(getSession: () => any, setSession: (session: any) => void, setPrevWorksheet: () => void, getPrevWorksheet: () => string | null): void {
        if (!getPrevWorksheet()) return;

        const session = getSession();
        session.Worksheets(this.switchPrevWorksheet).Activate();
        setPrevWorksheet();

        setSession(session);
    }
}