import { JSONSchema7 } from 'json-schema';

import { translate } from '#src-app/hooks/useTranslations';

export const propertyCustomCredential: JSONSchema7 = {
    title: translate('Credentials.ActionFormSelect.Form.Section.Title'),
    type: 'string',
};

export const schemaCustomCredential =
    {
        'title': translate('Credentials.ActionFormSelect.Form.Section.Title'),
        'ui:widget': 'CredentialWidget',
    };
