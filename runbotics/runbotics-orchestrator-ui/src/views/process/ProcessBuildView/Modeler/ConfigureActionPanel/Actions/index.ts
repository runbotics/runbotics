import { translate } from 'src/hooks/useTranslations';

import getApiActions from './api.actions';
import getApplicationActions from './application.actions';
import getAsanaActions from './asana.actions';
import getBeeOfficeActions from './beeOffice.actions';
import getBrowserActions from './browser.actions';
import getCsvActions from './csv.actions';
import getDesktopOfficeActions from './desktopOffice.actions';
import getFileActions from './file.actions';
import getGeneralActions from './general.actions';
import getGoogleSheetsActions from './googleSheets.actions';
import getJavascriptActions from './javascript.actions';
import getJiraActions from './jira.actions';
import getMailActions from './mail.actions';
import getSapActions from './sap.actions';
import getSharepointExcelActions from './sharepointExcel.actions';
import getSharepointFileActions from './sharepointFile.actions';
import { IBpmnAction, Runner } from './types';
import getVariablesActions from './variables.actions';

const internalBpmnActions: Readonly<Record<string, IBpmnAction>> = {
    'loop.init': {
        id: 'loop.init',
        label: translate('Process.Details.Modeler.Actions.Loop.Loop1.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Loop.Loop1.Label',
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
        translateKey: 'Process.Details.Modeler.Actions.Loop.Loop2.Label',
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
    ...getBeeOfficeActions(),
    ...getSapActions(),
    ...getApplicationActions(),
    ...getGeneralActions(),
    ...getVariablesActions(),
    ...getFileActions(),
    ...getCsvActions(),
    ...getSharepointExcelActions(),
    ...getSharepointFileActions(),
    ...getDesktopOfficeActions(),
    ...getBrowserActions(),
    ...getJavascriptActions(),
    ...getMailActions(),
    ...getAsanaActions(),
    ...getGoogleSheetsActions(),
    ...getJiraActions(),
    ...getApiActions(),
};

export default internalBpmnActions;
