import englishModalsActionsTranslations from '#src-app/translations/en/users/actions/modals';

const modalsActionsTranslations: typeof englishModalsActionsTranslations  = {
    'Users.Actions.Modals.DeleteModal.TitleMessage': 'Czy na pewno chcesz usunąć następujących użytkowników?',
    'Users.Actions.Modals.DeleteModal.Success': 'Pomyślnie usunięto wybranego użytkownika: {{ userEmail }}',
    'Users.Actions.Modals.DeleteModal.Error': 'Wystąpił błąd podczas usuwania użytkownika: {{ userEmail }}',
    'Users.Actions.Modals.DeleteModal.Button.Cancel': 'Anuluj',
    'Users.Actions.Modals.DeleteModal.Button.Delete': 'Usuń'
};

export default modalsActionsTranslations;
