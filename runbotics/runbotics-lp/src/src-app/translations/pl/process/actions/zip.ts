import englishZipTranslations from '../../../en/process/actions/zip';

const zipTranslations: typeof englishZipTranslations  = {
    'Process.Details.Modeler.Actions.Zip.Path': 'Ścieżka',
    'Process.Details.Modeler.Actions.Zip.UnzipArchive.Label': 'Rozpakuj archiwum',
    'Process.Details.Modeler.Actions.Zip.UnzipArchive.Name': 'Nazwa',
    'Process.Details.Modeler.Actions.Zip.UnzipArchive.Path.Info': 'Ścieżka do folderu zawierającego plik zip, np. "C:\\Users\\User\\Documents". Rozpakowany plik znajduje się w podfolderze, np. "C:\\Users\\User\\Documents\\fileName\\fileName.txt".',

    'Process.Details.Modeler.Actions.Zip.UnzipArchive.OutputDirectory': 'Ścieżka wyjściowa',
    'Process.Details.Modeler.Actions.Zip.UnzipArchive.OutputName': 'Nazwa katalogu wyjściowego',

    'Process.Details.Modeler.Actions.Zip.UnzipArchive.Name.Info': 'Nazwa pliku (bez rozszerzenia), np. "zippedArchive".',
    'Process.Details.Modeler.Actions.Zip.CreateArchive.Label': 'Stwórz archiwum',
    'Process.Details.Modeler.Actions.Zip.Zip.Path': 'Pełna ścieżka do pliku/folderu do archiwizacji',
    'Process.Details.Modeler.Actions.Zip.CreateArchive.ZipPath': 'Pełna ścieżka do pliku zip',
    'Process.Details.Modeler.Actions.Zip.CreateArchive.Path.Info': 'Ścieżka do pliku (z roszerzeniem) lub folderu, który jest przeznaczony do archiwizacji. Jeśli ścieżka nie jest absolutna, archiwum zostanie utworzone w folderze tymczasowym',
    'Process.Details.Modeler.Actions.Zip.CreateArchive.ZipPath.Info': 'Ścieżka do pliku zip, który ma zostać stworzony (razem z rozszerzeniem .zip). Jeśli podana zostanie tylko nazwa pod którą ma być zapisany zip, archiwum zostanie stworzone w folderze tymczasowym pod tą samą nazwą',
    'Process.Details.Modeler.Actions.Zip.CreateArchive.Output.Info': 'Ścieżka do powstałego archiwum'
};

export default zipTranslations;
