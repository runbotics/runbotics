import englishCreateCollectionsResponse from '#src-app/translations/en/collections/createCollectionsResponse';

const createCollectionsResponse: typeof englishCreateCollectionsResponse = {
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Default': 'Coś poszło nie tak. Szczegóły: {{ detail }} | {{ status }}',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Noname': 'Nazwa nie może być pusta',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Nameexists': 'W tym katalogu istnieje już kolekcja o tej nazwie',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Idexists': 'Wystąpił nieoczekiwany błąd - istnieje już kolekcja o takim id',
    'Process.Collection.Dialog.Create.Success': 'Kolekcja została utworzona pomyślnie',
};

export default createCollectionsResponse;
