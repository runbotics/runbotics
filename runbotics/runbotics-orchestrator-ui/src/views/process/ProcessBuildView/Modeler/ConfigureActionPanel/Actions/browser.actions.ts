import { translate } from 'src/hooks/useTranslations';
import { IBpmnAction, Runner } from './types';

const exampleJsonConfiguration = {
    actionParams: {
        rows: {
            isArray: true,
            xpath: "//table[../span[@aria-label='Report table']]//tr[position()>1]",
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
const getBrowserActions: () => Record<string, IBpmnAction> = () => ({
    'browser.selenium.open': {
        id: 'browser.selenium.open',
        label: translate('Process.Details.Modeler.Actions.Browser.Open.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.Open.Label',
        script: 'browser.selenium.open',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Browser.Open.Input'),
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
                'ui:order': ['input'],
                input: {
                    target: {
                        'ui:widget': 'ElementAwareAutocomplete',
                    },
                },
            },
            formData: {
                input: {
                    target: 'https://example.com',
                },
            },
        },
    },
    'browser.launch': {
        id: 'browser.launch',
        label: translate('Process.Details.Modeler.Actions.Browser.Launch.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.Launch.Label',
        script: 'browser.launch',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Browser.Launch.Input'),
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
                },
            },
        },
    },
    'browser.close': {
        id: 'browser.close',
        label: translate('Process.Details.Modeler.Actions.Browser.Close.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.Close.Label',
        script: 'browser.close',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Browser.Close.Input'),
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
        id: 'browser.selenium.click',
        label: translate('Process.Details.Modeler.Actions.Browser.Click.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.Click.Label',
        script: 'browser.selenium.click',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Browser.Click.Input'),
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
            },
            formData: {
                input: {
                    target: 'id=',
                },
            },
        },
    },
    'browser.selenium.elements.count': {
        id: 'browser.selenium.elements.count',
        label: translate('Process.Details.Modeler.Actions.Browser.CountElements.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.CountElements.Label',
        script: 'browser.selenium.elements.count',
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
                        title: translate('Process.Details.Modeler.Actions.Browser.CountElements.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Browser.CountElements.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Browser.CountElements.Variable'),
                                description: translate(
                                    'Process.Details.Modeler.Actions.Browser.CountElements.VariableText',
                                ),
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
                input: {
                    target: 'xpath=',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'browser.selenium.element.attribute.change': {
        id: 'browser.selenium.element.attribute.change',
        label: translate('Process.Details.Modeler.Actions.Browser.ChangeElementAttribute.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.ChangeElementAttribute.Label',
        script: 'browser.selenium.element.attribute.change',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Browser.ChangeElementAttribute.Input'),
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
            },
            formData: {
                input: {
                    target: 'id=',
                    attribute: '',
                    newValue: '',
                },
            },
        },
    },
    'browser.selenium.type': {
        id: 'browser.selenium.type',
        label: translate('Process.Details.Modeler.Actions.Browser.Type.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.Type.Label',
        script: 'browser.selenium.type',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Browser.Type.Input'),
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
                        },
                        required: ['target', 'value'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    target: 'id=',
                    value: '',
                },
            },
        },
    },
    'browser.selenium.wait': {
        id: 'browser.selenium.wait',
        label: translate('Process.Details.Modeler.Actions.Browser.Wait.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.Wait.Label',
        script: 'browser.selenium.wait',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Browser.Wait.Input'),
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
        id: 'browser.selenium.editContent',
        label: translate('Process.Details.Modeler.Actions.Browser.EditContent.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.EditContent.Label',
        script: 'browser.selenium.editContent',
        runner: Runner.BROWSER_FRONTEND_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Browser.EditContent.Input'),
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
            },
            formData: {
                input: {
                    target: 'id=',
                },
            },
        },
    },
    'browser.selenium.select': {
        id: 'browser.selenium.select',
        label: translate('Process.Details.Modeler.Actions.Browser.Select.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.Select.Label',
        script: 'browser.selenium.select',
        runner: Runner.DESKTOP_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Browser.Select.Input'),
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
            },
            formData: {
                input: {
                    target: 'id=',
                    value: 'value=',
                },
            },
        },
    },
    'browser.waitForElement': {
        id: 'browser.waitForElement',
        label: translate('Process.Details.Modeler.Actions.Browser.WaitForElement.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.WaitForElement.Label',
        script: 'browser.wait',
        runner: Runner.BROWSER_FRONTEND_SCRIPT,
        form: {
            schema: {
                type: 'object',
                properties: {
                    input: {
                        title: translate('Process.Details.Modeler.Actions.Browser.WaitForElement.Input'),
                        type: 'object',
                        properties: {
                            xpath: {
                                title: translate('Process.Details.Modeler.Actions.Browser.WaitForElement.Target'),
                                type: 'string',
                            },
                        },
                        required: ['xpath'],
                    },
                },
            },
            uiSchema: {
                'ui:order': ['input'],
            },
            formData: {
                input: {
                    target: 'xpath',
                },
            },
        },
    },
    'browser.read.attribute': {
        id: 'browser.read.attribute',
        label: translate('Process.Details.Modeler.Actions.Browser.Read.Attribute.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.Read.Label',
        script: 'browser.read.attribute',
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
                        title: translate('Process.Details.Modeler.Actions.Browser.Read.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Browser.Read.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Read.Variable'),
                                description: translate('Process.Details.Modeler.Actions.Browser.Read.VariableText'),
                                type: 'string',
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
                    target: '',
                    attribute: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'browser.read.text': {
        id: 'browser.read.text',
        label: translate('Process.Details.Modeler.Actions.Browser.Read.Text.Label'),
        script: 'browser.read.text',
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
                        title: translate('Process.Details.Modeler.Actions.Browser.Read.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Browser.Read.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Read.Variable'),
                                description: translate('Process.Details.Modeler.Actions.Browser.Read.VariableText'),
                                type: 'string',
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
                    target: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'browser.read.input': {
        id: 'browser.read.input',
        label: translate('Process.Details.Modeler.Actions.Browser.Read.Input.Label'),
        script: 'browser.read.input',
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
                        title: translate('Process.Details.Modeler.Actions.Browser.Read.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Browser.Read.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Read.Variable'),
                                description: translate('Process.Details.Modeler.Actions.Browser.Read.VariableText'),
                                type: 'string',
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
                    target: '',
                },
                output: {
                    variableName: '',
                },
            },
        },
    },
    'browser.index': {
        id: 'browser.index',
        label: translate('Process.Details.Modeler.Actions.Browser.Index.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.Index.Label',
        script: 'browser.index',
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
                        title: translate('Process.Details.Modeler.Actions.Browser.Index.Input'),
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
                        title: translate('Process.Details.Modeler.Actions.Browser.Index.Output'),
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Browser.Index.Variable'),
                                description: translate('Process.Details.Modeler.Actions.Browser.Index.VariableText'),
                                type: 'string',
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
        id: 'browser.selenium.takeScreenshot',
        label: translate('Process.Details.Modeler.Actions.Browser.TakeScreenshot.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.TakeScreenshot.Label',
        script: 'browser.selenium.takeScreenshot',
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
                    output: {
                        title: 'Output',
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Browser.TakeScreenshot.Variable'),
                                description: translate('Process.Details.Modeler.Actions.Browser.TakeScreenshot.VariableText'),
                                type: 'string',
                            },
                        },
                    },
                },
            },
            uiSchema: {
                'ui:order': ['output'],
            },
            formData: {
                output: {
                    variableName: '',
                },
            },
        },
    },
    'browser.selenium.printToPdf': {
        id: 'browser.selenium.printToPdf',
        label: translate('Process.Details.Modeler.Actions.Browser.PrintToPdf.Label'),
        translateKey: 'Process.Details.Modeler.Actions.Browser.PrintToPdf.Label',
        script: 'browser.selenium.printToPdf',
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
                                title: translate('Process.Details.Modeler.Actions.Browser.PrintToPdf.Target'),
                                type: 'string',
                                enum: ['Session', 'Url'],
                                default: 'Session',
                            },
                        },
                        required: ['target'],
                        dependencies: {
                            target: {
                                oneOf: [
                                    {
                                        properties: {
                                            target: {
                                                enum: ['Session'],
                                            },
                                        },
                                    },
                                    {
                                        properties: {
                                            target: {
                                                enum: ['Url'],
                                            },
                                            url: {
                                                type: 'string',
                                                title: translate('Process.Details.Modeler.Actions.Browser.PrintToPdf.Url'),
                                            },
                                        },
                                    },
                                ],
                            },
                        },
                    },
                    output: {
                        title: 'Output',
                        type: 'object',
                        properties: {
                            variableName: {
                                title: translate('Process.Details.Modeler.Actions.Browser.PrintToPdf.Variable'),
                                description: translate('Process.Details.Modeler.Actions.Browser.PrintToPdf.VariableText'),
                                type: 'string',
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
                    target: 'Session',
                    url: undefined,
                },
                output: {
                    variableName: undefined,
                },
            },
        },
    },
});

export default getBrowserActions;
