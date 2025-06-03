import englishModalsActionsTranslations from '#src-app/translations/en/users/actions/modals';

const modalsActionsTranslations: typeof englishModalsActionsTranslations  = {
    'Users.Actions.Modals.DeleteModal.Delete.TitleMessage': 'Czy na pewno chcesz usunąć następujących użytkowników?',
    'Users.Actions.Modals.DeleteModal.Decline.TitleMessage': 'Czy na pewno chcesz odrzucić następujących użytkowników?',
    'Users.Actions.Modals.DeleteModal.Success': 'Pomyślnie usunięto wybranego użytkownika: {{ userEmail }}',
    'Users.Actions.Modals.DeleteModal.Error': 'Wystąpił błąd podczas usuwania użytkownika: {{ userEmail }}',
    'Users.Actions.Modals.DeleteModal.ErrorWithMessage': 'Wystąpił błąd podczas usuwania użytkownika: {{ userEmail }}. Powód: {{ message }}',
    'Users.Actions.Modals.DeleteModal.Button.Cancel': 'Anuluj',
    'Users.Actions.Modals.DeleteModal.Button.Delete': 'Usuń',
    'Users.Actions.Modals.DeleteModal.Button.Decline': 'Odrzuć',
    'Users.Actions.Modals.DeleteModal.DeclineReason.RadioControl.Title': 'Wybierz powód:',
    'Users.Actions.Modals.DeleteModal.DeclineReason.RadioControl.Label.CustomReason': 'Prośba o aktywację twojego konta została odrzucona. Z powodu:',
    'Users.Actions.Modals.DeleteModal.DeclineReason.RadioControl.Label.DefaultReason': 'Prośba o aktywację twojego konta została odrzucona.',
    'Users.Actions.Modals.DeleteModal.DeclineReason.TextField.Label.Message': 'Wiadomość'
};

export default modalsActionsTranslations;
