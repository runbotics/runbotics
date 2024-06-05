import { AsanaAction, ActionRegex } from 'runbotics-common';

import { ActionCredentialType } from '#src-app/Actions/action-credential-type';
import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getAsanaActions: () => Record<string, IBpmnAction & Required<Pick<IBpmnAction, 'credentialType'>>> = () => ({
    'asana.test': {
        id: AsanaAction.TEST,
        credentialType: ActionCredentialType.ASANA,
        label: translate('Process.Details.Modeler.Actions.Asana.Test.Label'),
        script: AsanaAction.TEST,
        runner: Runner.DESKTOP_SCRIPT,
        output: {
            assignVariables: true,
            outputMethods: {
                variableName: '${content.output[0]}',
            },
        },
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Common.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),

                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                output: {
                    variableName: {
                        'ui:options': {
                            info: translate('Process.Details.Modeler.Actions.Common.VariableName.Info'),
                        },
                    },
                },
            },
            formData: {
                input: {},
                output: {
                    variableName: undefined,
                },
            },
        },
    },
});

export default getAsanaActions;
