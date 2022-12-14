import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';



const getGoogleSheetsActions: () => Record<string, IBpmnAction> = () => ({
    'google.sheets.write': {
        id: 'google.sheets.write',
        label: translate('Process.Details.Modeler.Actions.Google.Sheets.Write.Label'),
        script: 'google.sheets.write',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.GoogleSheets.Write.Input'),
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
                    values: '',
                },
            },
        },
    },
});

export default getGoogleSheetsActions;
