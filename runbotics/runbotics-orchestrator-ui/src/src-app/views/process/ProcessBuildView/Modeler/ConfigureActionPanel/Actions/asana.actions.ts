import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';

const getAsanaActions: () => Record<string, IBpmnAction> = () => ({
    'asana.test': {
        id: 'asana.test',
        label: translate('Process.Details.Modeler.Actions.Asana.Test.Label'),
        script: 'asana.test',
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
                        title: translate('Process.Details.Modeler.Actions.Asana.Input'),
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                    output: {
                        title: translate('Process.Details.Modeler.Actions.Asana.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Asana.Output.VariableName'),
                                description: translate('Process.Details.Modeler.Actions.Asana.Output.VariableMessage'),
                                type: 'string',
                            },
                        },
                        required: ['variableName'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {},
                output: {
                    variableName: '',
                },
            },
        },
    },
});

export default getAsanaActions;
