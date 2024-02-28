import englishCreateCollectionsResponse from '#src-app/translations/en/collections/processCollectionResponse';

const createCollectionsResponse: typeof englishCreateCollectionsResponse = {
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Default': 'Coś poszło nie tak. Szczegóły: {{ detail }} | {{ status }}',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Noname': 'Nazwa nie może być pusta',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Nameexists': 'W tym katalogu istnieje już zbiór o tej nazwie',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Parentnotfound': 'Docelowy zbiór-rodzic nie istnieje',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Idexists': 'Wystąpił nieoczekiwany błąd - istnieje już zbiór o takim id',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Idnotfound': 'Wystąpił nieoczekiwany błąd - zbiór o takim id nie istnieje',
    'Process.Collection.Dialog.Create.Success': 'Pomyślnie utworzono nowy zbiór',
    'Process.Collection.Dialog.Update.Success': 'Pomyślnie zaktualizowano zbiór',
};

export default createCollectionsResponse;
