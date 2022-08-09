import { translate } from 'src/hooks/useTranslations';
import { IBpmnAction, Runner } from './types';
import beeOfficeActions from './BeeOfficeActions';
import sapActions from './SAPActions';
import applicationActions from './ApplicationActions';
import generalActions from './GeneralActions';
import variablesActions from './VariablesActions';
import fileActions from './FileActions';
import csvActions from './CsvActions';
import sharepointExcelActions from './SharepointExcelActions';
import desktopOfficeActions from './DesktopOfficeActions';
import sharepointFileActions from './SharepointFileActions';
import browserActions from './BrowserActions';
import javascriptActions from './JavascriptActions';
import mailActions from './MailActions';
import asanaActions from './AsanaActions';
import googleSheetsActions from './GoogleSheetsActions';
import jiraActions from './JiraActions';
import apiActions from './ApiActions';

const internalBpmnActions: Readonly<Record<string, IBpmnAction>> = {
    'loop.init': {
        id: 'loop.init',
        label: translate('Process.Details.Modeler.Actions.Loop.Loop1.Label'),
        script: 'loop.init',
        runner: Runner.DESKTOP_SCRIPT,
        output: {
            assignVariables: false,
            outputMethods: {},
        },
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Loop.Loop1.Input'),
                        type: 'object',
                        oneOf: [
                            {
                                title: translate('Process.Details.Modeler.Actions.Loop.Loop1.Manual'),
                                properties: {
                                    list: {
                                        title: translate('Process.Details.Modeler.Actions.Loop.Loop1.List'),
                                        type: 'array',
                                        items: {
                                            type: 'string',
                                        },
                                    },
                                },
                                required: ['list'],
                            },
                            {
                                title: translate('Process.Details.Modeler.Actions.Loop.Loop1.Variable'),
                                properties: {
                                    variable: {
                                        title: translate(
                                            'Process.Details.Modeler.Actions.Loop.Loop1.Variable.Variable',
                                        ),
                                        type: 'string',
                                        items: {
                                            type: 'string',
                                        },
                                    },
                                },
                                required: ['variable'],
                            },
                        ],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                output: {
                    stepsCount: {
                        'ui:disabled': true,
                    },
                },
            },
            formData: {
                input: {},
                output: {
                    stepsCount: '${content.output[0].stepsCount}',
                    stepIdx: '0',
                    list: '${content.output[0].list}',
                },
            },
        },
    },
    'loop.loop': {
        id: 'loop.loop',
        label: translate('Process.Details.Modeler.Actions.Loop.Loop2.Label'),
        script: 'loop.loop',
        runner: Runner.BPMN,
        output: {
            assignVariables: false,
            outputMethods: {},
        },
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Loop.Loop2.Input'),
                        type: 'object',
                        properties: {
                            loopType: {
                                title: translate('Process.Details.Modeler.Actions.Loop.Loop2.Input'),
                                type: 'string',
                                enum: ['Collection', 'Repeat'],
                                default: ['Repeat'],
                            },
                        },
                        dependencies: {
                            loopType: {
                                oneOf: [
                                    {
                                        properties: {
                                            loopType: {
                                                enum: ['Collection'],
                                            },
                                            collection: {
                                                title: translate('Process.Details.Modeler.Actions.Loop.Loop2.Variable'),
                                                type: 'string',
                                                format: 'variableName',
                                            },
                                            elementVariable: {
                                                title: translate('Process.Details.Modeler.Actions.Loop.Loop2.ElementVariable'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['collection'],
                                    },
                                    {
                                        properties: {
                                            loopType: {
                                                enum: ['Repeat'],
                                            },
                                            iterations: {
                                                title: translate('Process.Details.Modeler.Actions.Loop.Loop2.NumberOfIterations'),
                                                type: 'string',
                                            },
                                        },
                                        required: ['iterations'],
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
            },
            formData: {
                input: {
                    collection: undefined,
                    elementVariable: undefined,
                    iterations: '1',
                },
                output: {},
            },
        },
    },
    ...beeOfficeActions,
    ...sapActions,
    ...applicationActions,
    ...generalActions,
    ...variablesActions,
    ...fileActions,
    ...csvActions,
    ...sharepointExcelActions,
    ...sharepointFileActions,
    ...desktopOfficeActions,
    ...browserActions,
    ...javascriptActions,
    ...mailActions,
    ...asanaActions,
    ...googleSheetsActions,
    ...jiraActions,
    ...apiActions,
};

export default internalBpmnActions;
