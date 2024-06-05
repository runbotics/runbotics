import { GoogleAction } from 'runbotics-common';

import { ActionCredentialType } from '#src-app/Actions/action-credential-type';
import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getGoogleSheetsActions: () => Record<string, IBpmnAction & Required<Pick<IBpmnAction, 'credentialType'>>> = () => ({
    'google.sheets.write': {
        id: GoogleAction.SHEETS_WRITE,
        credentialType: ActionCredentialType.GOOGLE,
        label: translate('Process.Details.Modeler.Actions.Google.Sheets.Write.Label'),
        script: GoogleAction.SHEETS_WRITE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            values: {
                                title: translate('Process.Details.Modeler.Actions.GoogleSheets.Write.Values'),
                                type: 'string',
                            },
                        },
                        required: ['values'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    values: undefined,
                },
            },
        },
    },
});

export default getGoogleSheetsActions;
