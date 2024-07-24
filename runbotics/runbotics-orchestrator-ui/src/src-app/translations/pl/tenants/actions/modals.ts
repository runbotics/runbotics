import englishModalsActionsTranslations from '#src-app/translations/en/tenants/actions/modals';

const modalsActionsTranslations: typeof englishModalsActionsTranslations = {
    'Tenants.Actions.Modals.DeleteModal.TitleMessage': 'Czy na pewno chcesz usunąć następujące organizacje?',
    'Tenants.Actions.Modals.DeleteModal.Message.Success': 'Pomyślnie usunięto organizacje',
    'Tenants.Actions.Modals.DeleteModal.Message.Fail': 'Błąd podczas usuwania organizacji',
    'Tenants.Actions.Modals.DeleteModal.Message.Fail.BadTenantID': 'Nie można znaleźć organizacji o podanym identyfikatorze',
    'Tenants.Actions.Modals.DeleteModal.Message.Fail.RelatedTenant': 'Nie można usunąć organizacji powiązanej z innymi zasobami',
    'Tenants.Actions.Modals.CreateModal.TitleMessage': 'Dodaj organizację',
    'Tenants.Actions.Modals.CreateModal.Field.Name': 'Nazwa',
    'Tenants.Actions.Modals.CreateModal.Button.Create': 'Stwórz',
    'Tenants.Actions.Modals.CreateModal.Message.Success': 'Pomyślnie utworzono organizacje',
    'Tenants.Actions.Modals.CreateModal.Message.Fail': 'Błąd podczas tworzenia organizacji',
};

export default modalsActionsTranslations;
