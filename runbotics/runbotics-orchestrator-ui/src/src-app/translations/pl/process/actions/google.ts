import googleActionsTranslations from '#src-app/translations/en/process/actions/google';

const googleTranslations: typeof googleActionsTranslations = {
    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Label': 'Nadpisz komrki',
    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.SpreadsheetID': 'ID arkusza',
    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.SpreadsheetID.Info': 'Udostępnianie arkusza dla konta technicznego usługi Google jest obowiązkowe',
    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.SheetName': 'Nazwa karty arkusza',
    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Range': 'Zakres komrek',
    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Range.Info': 'Zakres komórek do nadpisania w wybranej lub domyślnej karcie arkusza, np. A1:Z100',
    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Values': 'Wartości komórek do nadpisania',
    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Values.Info': 'Wartości komórek do nadpisania w formacie tablicy 2D, np. [["a", "b", "c"], ["d", "e", "f"]]',
    'Process.Details.Modeler.Actions.Google.Sheets.SetCells.Output.Info': 'Dane o statusie nadpisanych wartości w arkuszu Google',

    'Process.Details.Modeler.Actions.Google.Sheets.GetWorksheet.Label': 'Pobierz arkusz',
    'Process.Details.Modeler.Actions.Google.Sheets.GetWorksheet.SpreadsheetID': 'ID arkusza',
    'Process.Details.Modeler.Actions.Google.Sheets.GetWorksheet.SpreadsheetID.Info': 'Udostępnianie arkusza dla konta technicznego usługi Google jest obowiązkowe',
    'Process.Details.Modeler.Actions.Google.Sheets.GetWorksheet.SheetName': 'Nazwa karty arkusza',
    'Process.Details.Modeler.Actions.Google.Sheets.GetWorksheet.Output.Info': 'Dane arkusza Google z tablicą wszystkich wartości karty arkusza',

    'Process.Details.Modeler.Actions.Google.Sheets.GetCell.Label': 'Pobierz komórkę',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCell.SpreadsheetID': 'ID arkusza',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCell.SpreadsheetID.Info': 'Udostępnianie arkusza dla konta technicznego usługi Google jest obowiązkowe',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCell.Cell': 'Adres komórki',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCell.Cell.Info': 'Adres komórki w wybranej lub domyślnej karcie arkusza, np. A123',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCell.SheetName': 'Nazwa karty arkusza',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCell.Output.Info': 'Dane arkusza Google z tablicą wartości karty arkusza dla wskazanego adresu komórki',

    'Process.Details.Modeler.Actions.Google.Sheets.GetCells.Label': 'Pobierz komórki',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCells.SpreadsheetID': 'ID arkusza',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCells.SpreadsheetID.Info': 'Udostępnianie arkusza dla konta technicznego usługi Google jest obowiązkowe',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCells.Range': 'Zakres komórek',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCells.Range.Info': 'Zakres komórek w wybranej lub domyślnej karcie arkusza, np. A1:Z100',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCells.SheetName': 'Nazwa karty arkusza',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCells.Output.Info': 'Dane arkusza Google z tablicą wartości karty arkusza dla wskazanego zakresu komórek',

    'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.Label': 'Pobierz komórki po wartości',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.SpreadsheetID': 'ID arkusza',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.SpreadsheetID.Info': 'Udostępnianie arkusza dla konta technicznego usługi Google jest obowiązkowe',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.SearchValue': 'Szukana wartość',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.SheetName': 'Nazwa karty arkusza',
    'Process.Details.Modeler.Actions.Google.Sheets.GetCellsByValue.Output.Info': 'Tablica obiektów z informacjami o komórce, której wartość pasuje do wartości wyszukiwania',
};

export default googleTranslations;
