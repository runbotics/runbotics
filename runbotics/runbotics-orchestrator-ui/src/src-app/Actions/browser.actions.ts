import { BrowserAction, ActionRegex, ActionCredentialType } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { propertyCustomCredential, schemaCustomCredential } from './actions.utils';
import { IBpmnAction, Runner } from './types';



const exampleJsonConfiguration = {
    actionParams: {
        rows: {
            isArray: true,
            xpath: '//table[../span[@aria-label=\'Report table\']]//tr[position()>1]',
            actionParams: {
                TaskGroup: {
                    xpath: '(./td)[1]',
                },
                TimeSpent: {
                    xpath: '(./td)[15]',
                },
            },
        },
    },
};
// eslint-disable-next-line max-lines-per-function
const getBrowserActions: () => Record<string, IBpmnAction> = () => ({
    'browser.launch': {
        id: BrowserAction.LAUNCH,
        label: translate('Process.Details.Modeler.Actions.Browser.Launch.Label'),
        script: BrowserAction.LAUNCH,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            headless: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Launch.Headless'),
                                type: 'boolean',
                            },
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Launch.Target'),
                                type: 'string',
                            },
                        },
                        required: ['headless'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    headless: true,
                    target: ''
                },
            },
        },
    },
    'browser.selenium.open': {
        id: BrowserAction.SELENIUM_OPEN,
        label: translate('Process.Details.Modeler.Actions.Browser.Selenium.Open.Label'),
        script: BrowserAction.SELENIUM_OPEN,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Open.Site'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input']
            },
            formData: {
                input: {
                    target: 'https://',
                },
            },
        },
    },
    'browser.close': {
        id: BrowserAction.CLOSE,
        label: translate('Process.Details.Modeler.Actions.Browser.Close.Label'),
        script: BrowserAction.CLOSE,
        runner: Runner.DESKTOP_SCRIPT,
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
                input: {},
            },
            formData: {
                input: {},
            },
        },
    },
    'browser.selenium.click': {
        id: BrowserAction.SELENIUM_CLICK,
        label: translate('Process.Details.Modeler.Actions.Browser.Selenium.Click.Label'),
        script: BrowserAction.SELENIUM_CLICK,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Click.Target'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                }
            },
            formData: {
                input: {
                    target: 'id=',
                },
            },
        },
    },
    'browser.selenium.elements.count': {
        id: BrowserAction.SELENIUM_ELEMENTS_COUNT,
        label: translate('Process.Details.Modeler.Actions.Browser.Selenium.Elements.Count.Label'),
        script: BrowserAction.SELENIUM_ELEMENTS_COUNT,
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
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Browser.CountElements.Target'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
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
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                },
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
                    target: 'xpath=',
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
    'browser.selenium.element.attribute.change': {
        id: BrowserAction.SELENIUM_ELEMENT_ATTRIBUTE_CHANGE,
        label: translate('Process.Details.Modeler.Actions.Browser.Selenium.Element.Attribute.Change.Label'),
        script: BrowserAction.SELENIUM_ELEMENT_ATTRIBUTE_CHANGE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Browser.ChangeElementAttribute.Target',
                                ),
                                type: 'string',
                            },
                            attribute: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Browser.ChangeElementAttribute.Attribute',
                                ),
                                type: 'string',
                            },
                            newValue: {
                                title: translate(
                                    'Process.Details.Modeler.Actions.Browser.ChangeElementAttribute.NewValue',
                                ),
                                type: 'string',
                            },
                        },
                        required: ['target', 'attribute'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                }
            },
            formData: {
                input: {
                    target: 'id=',
                    attribute: undefined,
                    newValue: '',
                },
            },
        },
    },
    'browser.selenium.type': {
        id: BrowserAction.SELENIUM_TYPE,
        label: translate('Process.Details.Modeler.Actions.Browser.Selenium.Type.Label'),
        script: BrowserAction.SELENIUM_TYPE,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Type.Target'),
                                type: 'string',
                            },
                            value: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Type.Value'),
                                type: 'string',
                            },
                            clear: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Type.Clear'),
                                type: 'boolean',
                            },
                        },
                        required: ['target', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                }
            },
            formData: {
                input: {
                    target: undefined,
                    value: undefined,
                    clear: false,
                },
            },
        },
    },
    [BrowserAction.SELENIUM_INSERT_CREDENTIALS]: {
        id: BrowserAction.SELENIUM_INSERT_CREDENTIALS,
        credentialType: ActionCredentialType.BROWSER_LOGIN,
        label: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.Label'),
        script: BrowserAction.SELENIUM_INSERT_CREDENTIALS,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                description: 'This action ends with submitting the form. If any other fields are required please add apropriate action before this one.',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            loginTarget: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.LoginTarget'),
                                type: 'string',
                            },
                            passwordTarget: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.PasswordTarget'),
                                type: 'string',
                            },
                            submitButtonTarget: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.SubmitButtonTarget'),
                                type: 'string',
                            },
                            customCredentialId: propertyCustomCredential,
                        },
                        required: ['loginTarget', 'passwordTarget', 'submitButtonTarget']
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    customCredentialId: schemaCustomCredential,
                    loginTarget: {
                        'ui:options': { defaultTarget: 'id=', selectorName: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.LoginSelector') },
                        'ui:widget': 'BrowserTargetWidget',
                    },
                    passwordTarget: {
                        'ui:options': { defaultTarget: 'id=', selectorName: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.PasswordSelector')  },
                        'ui:widget': 'BrowserTargetWidget',
                    },
                    submitButtonTarget: {
                        'ui:options': { defaultTarget: 'id=', selectorName: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.SubmitButtonSelector')  },
                        'ui:widget': 'BrowserTargetWidget',
                    },
                },
            },
            formData: {
                input: {
                    loginTarget: undefined,
                    passwordTarget: undefined,
                    submitButtonTarget: undefined,
                }
            },
        },
    },
    //     id: BrowserAction.SELENIUM_INSERT_CREDENTIALS,
    //     credentialType: ActionCredentialType.BROWSER_LOGIN,
    //     label: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.Label'),
    //     script: BrowserAction.SELENIUM_INSERT_CREDENTIALS,
    //     runner: Runner.DESKTOP_SCRIPT,
    //     form: {
    //         schema: {
    //             type: 'object',
    //             description: 'This action ends with submitting the form. If any other fields are required please add apropriate action before this one.',
    //             properties: {
    //                 input: {
    //                     title: translate('Process.Details.Modeler.Actions.Common.Input'),
    //                     type: 'object',
    //                     properties: {
    //                         login: {
    //                             properties: {
    //                                 loginTarget: {
    //                                     title: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.LoginTarget'),
    //                                     type: 'string',
    //                                 },
    //                             },
    //                             required: ['loginTarget'],
    //                         },
    //                         password: {
    //                             properties: {
    //                                 passwordTarget: {
    //                                     title: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.PasswordTarget'),
    //                                     type: 'string',
    //                                 }
    //                             },
    //                             required: ['passwordTarget']
    //                         },
    //                         submit: {
    //                             properties: {
    //                                 submitButtonTarget: {
    //                                     title: translate('Process.Details.Modeler.Actions.Browser.Selenium.InsertCredentials.SubmitButtonTarget'),
    //                                     type: 'string',
    //                                 },
    //                             },
    //                             required: ['submitButtonTarget'],
    //                         },
    //                         customCredentialId: propertyCustomCredential,
    //                     },
    //                 },
    //             },
    //         },
    //         uiSchema: {
    //             'ui:order': ['input'],
    //             input: {
    //                 customCredentialId: schemaCustomCredential,
    //                 login: {
    //                     loginTarget: {
    //                         'ui:options': { defaultTarget: 'id=' },
    //                         'ui:widget': 'BrowserTargetWidget',
    //                     }
    //                 },
    //                 password: {
    //                     passwordTarget: {
    //                         'ui:options': { defaultTarget: 'id=' },
    //                         'ui:widget': 'BrowserTargetWidget',
    //                     }
    //                 },
    //                 submit: {
    //                     submitButtonTarget: {
    //                         'ui:options': { defaultTarget: 'id=' },
    //                         'ui:widget': 'BrowserTargetWidget',
    //                     }
    //                 }
    //             },
    //         },
    //         formData: {
    //             input: {
    //                 login: {
    //                     loginTarget: undefined,
    //                     value: ''
    //                 },
    //                 password: {
    //                     passwordTarget: undefined,
    //                     value: ''
    //                 },
    //                 submit: {
    //                     submitButtonTarget: undefined,
    //                     value: ''
    //                 }
    //             }
    //         },
    //     },
    // },
    'browser.selenium.wait': {
        id: BrowserAction.SELENIUM_WAIT,
        label: translate('Process.Details.Modeler.Actions.Browser.Selenium.Wait.Label'),
        script: BrowserAction.SELENIUM_WAIT,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Wait.Target'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                }
            },
            formData: {
                input: {
                    target: 'id=',
                    value: '',
                },
            },
        },
    },
    'browser.selenium.editContent': {
        id: BrowserAction.SELENIUM_EDIT_CONTENT,
        label: translate('Process.Details.Modeler.Actions.Browser.Selenium.EditContent.Label'),
        script: BrowserAction.SELENIUM_EDIT_CONTENT,
        runner: Runner.BROWSER_FRONTEND_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Browser.EditContent.Target'),
                                type: 'string',
                            },
                        },
                        required: ['target'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                }
            },
            formData: {
                input: {
                    target: 'id=',
                },
            },
        },
    },
    'browser.selenium.select': {
        id: BrowserAction.SELENIUM_SELECT,
        label: translate('Process.Details.Modeler.Actions.Browser.Selenium.Select.Label'),
        script: BrowserAction.SELENIUM_SELECT,
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Common.Input'),
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Select.Target'),
                                type: 'string',
                            },
                            value: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Select.Value'),
                                type: 'string',
                            },
                        },
                        required: ['target', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                }
            },
            formData: {
                input: {
                    target: 'id=',
                    value: 'value=',
                },
            },
        },
    },
    'browser.read.attribute': {
        id: BrowserAction.READ_ATTRIBUTE,
        label: translate('Process.Details.Modeler.Actions.Browser.Read.Attribute.Label'),
        script: BrowserAction.READ_ATTRIBUTE,
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
                            target: {
                                title: 'Target',
                                type: 'string',
                            },
                            attribute: {
                                title: 'Attribute',
                                type: 'string',
                            },
                        },
                        required: ['target', 'attribute'],
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
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                },
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
                    target: 'id=',
                    attribute: undefined,
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'browser.read.text': {
        id: BrowserAction.READ_TEXT,
        label: translate('Process.Details.Modeler.Actions.Browser.Read.Text.Label'),
        script: BrowserAction.READ_TEXT,
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
                            target: {
                                title: 'Target',
                                type: 'string',
                            },
                        },
                        required: ['target'],
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
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                },
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
                    target: 'id=',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'browser.read.input': {
        id: BrowserAction.READ_INPUT,
        label: translate('Process.Details.Modeler.Actions.Browser.Read.Input.Label'),
        script: BrowserAction.READ_INPUT,
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
                            target: {
                                title: 'Target',
                                type: 'string',
                            },
                        },
                        required: ['target'],
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
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                },
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
                    target: 'id=',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'browser.index': {
        id: BrowserAction.INDEX,
        label: translate('Process.Details.Modeler.Actions.Browser.Index.Label'),
        script: BrowserAction.INDEX,
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
                            jsonConfiguration: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Index.Configuration'),
                                type: 'string',
                            },
                        },
                        required: ['jsonConfiguration'],
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
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    jsonConfiguration: {
                        'ui:widget': 'JsonViewWidget',
                    },
                },
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
                    jsonConfiguration: JSON.stringify(exampleJsonConfiguration),
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'browser.selenium.takeScreenshot': {
        id: BrowserAction.SELENIUM_TAKE_SCREENSHOT,
        label: translate('Process.Details.Modeler.Actions.Browser.Selenium.TakeScreenshot.Label'),
        script: BrowserAction.SELENIUM_TAKE_SCREENSHOT,
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
                        title: 'Input',
                        type: 'object',
                        properties: {
                            target: {
                                title: translate('Process.Details.Modeler.Actions.Browser.TakeScreenshot.Input.Label'),
                                type: 'string',
                            },
                        },
                    },
                    output: {
                        title: 'Output',
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Common.VariableName'),

                                type: 'string',
                                pattern: ActionRegex.VARIABLE_NAME,
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input', 'output'],
                input: {
                    target: {
                        'ui:widget': 'BrowserTargetWidget',
                    }
                },
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
                    target: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
});

export default getBrowserActions;
