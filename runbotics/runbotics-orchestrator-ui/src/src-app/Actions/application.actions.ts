import { ApplicationAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner, ActionSystem } from './types';



const getApplicationActions: () => Record<string, IBpmnAction> = () => ({
    'application.launch': {
        id: ApplicationAction.LAUNCH,
        label: translate('Process.Details.Modeler.Actions.Application.Launch.Label'),
        script: ApplicationAction.LAUNCH,
        runner: Runner.DESKTOP_SCRIPT,
        system: ActionSystem.WINDOWS,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
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
