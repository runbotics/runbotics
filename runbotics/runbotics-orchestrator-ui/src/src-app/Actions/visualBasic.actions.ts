import { VisualBasicAction, ActionRegex } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { ActionSystem, IBpmnAction, Runner } from './types';

const getVisualBasicActions: () => Record<string, IBpmnAction> = () => ({
    'vBasic.runMacro': {
        id: VisualBasicAction.RUN_MACRO,
        label: translate('Process.Details.Modeler.Actions.VBasic.RunMacro.Label'),
        script: VisualBasicAction.RUN_MACRO,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
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
                        properties: {
                            scriptPath: {
                                title: translate('Process.Details.Modeler.Actions.VBasic.RunMacro.Input.ScriptPath'),
                                type: 'string',
                            },
                            scriptArguments: {
                                title: translate('Process.Details.Modeler.Actions.VBasic.RunMacro.Input.ScriptArguments'),
                                type: 'string',
                            },
                        },
                        required: ['scriptPath'],
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

export default getVisualBasicActions;
