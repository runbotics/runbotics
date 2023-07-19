import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, ActionSystem } from './types';



const getApplicationActions: () => Record<string, IBpmnAction> = () => ({
    'application.launch': {
        id: 'application.launch',
        label: translate('Process.Details.Modeler.Actions.Application.Launch.Label'),
        script: 'application.launch',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Application.Launch.Input'),
                        type: 'object',
                        properties: {
                            location: {
                                title: translate('Process.Details.Modeler.Actions.Application.Launch.Location'),
                                type: 'string',
                            },
                        },
                        required: ['location'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    location: undefined,
                },
            },
        },
    },
    'application.close': {
        id: 'application.close',
        label: translate('Process.Details.Modeler.Actions.Application.Close.Label'),
        script: 'application.close',
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Application.Close.Input'),
                        type: 'object',
                        properties: {},
                        required: [],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {},
            },
        },
    },
});

export default getApplicationActions;
