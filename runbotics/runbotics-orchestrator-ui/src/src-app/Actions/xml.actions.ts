import { ActionRegex, XmlAction } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction, Runner } from './types';


const getXmlActions: () => Record<string, IBpmnAction> = () => ({
    [XmlAction.XML_TO_JSON]: {
        id: XmlAction.XML_TO_JSON,
        label: translate('Process.Details.Modeler.Actions.Xml.XmlToJson.Label'),
        script: XmlAction.XML_TO_JSON,
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
                        properties: {
                            xml: {
                                title: translate('Process.Details.Modeler.Actions.Xml.XmlToJson.Xml'),
                                type: 'string',
                            },
                        },
                        required: ['xml'],
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
                input: {
                    xml: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    [XmlAction.JSON_TO_XML]: {
        id: XmlAction.JSON_TO_XML,
        label: translate('Process.Details.Modeler.Actions.Xml.JsonToXml.Label'),
        script: XmlAction.JSON_TO_XML,
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
                        properties: {
                            json: {
                                title: translate('Process.Details.Modeler.Actions.Xml.JsonToXml.Json'),
                                type: 'string',
                            },
                        },
                        required: ['json'],
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
                input: {
                    json: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
});

export default getXmlActions;
