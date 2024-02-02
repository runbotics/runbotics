import englishCreateCollectionsResponse from '#src-app/translations/en/collections/createCollectionsResponse';

const createCollectionsResponse: typeof englishCreateCollectionsResponse = {
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Default': 'Coś poszło nie tak. Szczegóły: {{ detail }} | {{ status }}',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.noname': 'Nazwa nie może być pusta',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.nameexists': 'W tym katalogu istnieje już kolekcja o tej nazwie',
    'Process.Collection.Dialog.Modify.Form.ErrorMessage.Error.Http.403':'Nie masz uprawnień do utworzenia kolekcji',
    'Process.Collection.Dialog.Create.Success': 'Kolekcja została utworzona pomyślnie',
};

export default createCollectionsResponse;
