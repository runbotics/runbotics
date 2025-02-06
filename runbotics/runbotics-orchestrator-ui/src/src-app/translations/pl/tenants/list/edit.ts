import englishEditListTranslations from '#src-app/translations/en/tenants/list/edit';

const editListTranslations: typeof englishEditListTranslations = {
    'Tenants.List.Edit.Form.Title': 'Edytuj organizacje',
    'Tenants.List.Edit.Form.Label.Name': 'Nazwa',
    'Tenants.List.Edit.Form.Section.Triggering': 'Uruchamianie',
    'Tenants.List.Edit.Form.Label.Whitelist': 'Lista zdalnego uruchamiania emailem',
    'Tenants.List.Edit.Form.Label.Whitelist.Tooltip': 'Lista zdalnego uruchamiania emailem. Akceptuje prawidłowe adresy email i domeny, które mogą uruchamiać procesy emailem w tej organizacji.',
    'Tenants.List.Edit.Form.Input.Label.Whitelist': 'Lista emaili',
    'Tenants.List.Edit.Form.Input.Placeholder.Whitelist': 'Wpisz dane',
    'Tenants.List.Edit.Form.Input.HelperText.Whitelist': 'Nieprawidłowa wartość wejściowa. Akceptowalne są tylko unikalne elementy, które są poprawnym adresem email lub domeną.',
    'Tenants.List.Edit.Form.Event.Success': 'Pomyślnie zapisano zmiany',
    'Tenants.List.Edit.Form.Event.Error': 'Błąd',
    'Tenants.List.Edit.Form.Event.Error.InvalidId': 'Nie prawidłowe ID',
    'Tenants.List.Edit.Form.Event.Error.NameNotAvailable': 'Nazwa jest już w użyciu',
    'Tenants.List.Edit.Form.Event.Error.UserNotFound': 'Niepoprawny użytkownik',
    'Tenants.List.Edit.Form.Error.FieldRequired': 'Pole wymagane',
    'Tenants.List.Edit.Form.Error.FieldTooShort': 'Nazwa musi zawierać co najmniej 2 znaki (wyłączając spacje)',
    'Tenants.List.Edit.Form.Accordion.Title': 'Udostępnianie',
    'Tenants.List.Edit.Form.Accordion.Link.Title': 'Link z zaproszeniem do organizacji',
    'Tenants.List.Edit.Form.Accordion.Link.Info': 'Ten link pozwoli zarejestrować się nowym użytkownikom w twojej organizacji - wyślij go zaufanym osobom. Kod ma swój termin ważności, po upływie tygodnia należy wygenerować nowy link.',
};

export default editListTranslations;
