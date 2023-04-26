/* eslint-disable */

import { Dictionary } from 'lodash';
import { translate as t } from '#src-app/hooks/useTranslations';
import { BPMNElementFactory, TaskType } from '../elementFactory/ElementFactory';

export enum ParameterDestination {
    Input = 'Input',
    Output = 'Output',
}

export enum ParameterType {
    TEXT = 'TEXT',
    MAP = 'MAP',
    LIST = 'LIST',
    Boolean = 'Boolean',
    Number = 'Number',
}

export interface BaseParameter<T> {
    name: string;
    value: T;
    type?: ParameterType;

    [key: string]: any;
}

export type ParameterMap = BaseParameter<Record<string, string>> & {
    // map?: Dictionary<string>;
};

export type ParameterList = BaseParameter<string[]> & {};

export type Parameter = BaseParameter<any>;

export interface TaskConfiguration {
    label: string;
    businessObject?: Dictionary<any>;
    inputParameters: Dictionary<Parameter>;
    outputParameters: Dictionary<Parameter>;
}

export type ServiceTaskConfiguration = TaskConfiguration & {
    script: string;
};

export default class CustomPalette {
    private bpmnFactory: any;
    private create: any;
    private elementFactory: any;
    private translate: any;
    private commandStack: any;

    createAndStartTaskType = (type: TaskType, configuration: TaskConfiguration) => {
        return (event: any) => {
            let bpmnElementFactory = new BPMNElementFactory(this.bpmnFactory, this.elementFactory, this.commandStack);
            let shape = bpmnElementFactory.createTaskType(type, configuration);

            const result = this.create.start(event, shape);
        };
    };

    createServiceTaskType = (kind: string, configuration: ServiceTaskConfiguration) => {
        const businessObject = {
            implementation: kind,
            runbotics: '',
        };
        configuration.businessObject = {
            ...configuration.businessObject,
            ...businessObject,
        };
        configuration.inputParameters['script'] = {
            name: 'script',
            value: configuration.script,
        };
        return this.createAndStartTaskType(TaskType.ServiceTask, configuration);
    };

    createBackgroundServiceTask = (configuration: ServiceTaskConfiguration) => {
        return this.createServiceTaskType('${environment.services.backgroundScript()}', configuration);
    };

    createScriptServiceTask = (configuration: ServiceTaskConfiguration) => {
        return this.createServiceTaskType('${environment.services.run()}', configuration);
    };

    createManualTask = (configuration: TaskConfiguration) => {
        return this.createAndStartTaskType(TaskType.ManualTask, configuration);
    };

    createFor = () => {
        return (event: any) => {
            let bpmnElementFactory = new BPMNElementFactory(this.bpmnFactory, this.elementFactory, this.commandStack);

            let initLoopConfiguration = bpmnElementFactory.createTaskType(
                TaskType.Task,
                {
                    label: 'init loop',
                    businessObject: {
                        name: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.InitLoop'),
                    },
                    inputParameters: {},
                    outputParameters: {
                        stepsCount: {
                            name: 'stepsCount',
                            value: '3',
                        },
                        stepIdx: {
                            name: 'stepIdx',
                            value: '0',
                        },
                        list: {
                            name: 'list',
                            value: '',
                            type: ParameterType.LIST,
                            list: ['a', 'b', 'c'],
                        },
                    },
                },
                { x: 0, y: 0 },
            );

            const firstGateway = this.bpmnFactory.create('bpmn:ExclusiveGateway');
            firstGateway.label = 'firstGateway';
            const firstGatewayShape = this.elementFactory.createShape({
                type: 'bpmn:ExclusiveGateway',
                businessObject: firstGateway,
                x: 150,
                y: 15,
            });

            const firstConnectionShape = bpmnElementFactory.createSequenceFlow({
                source: initLoopConfiguration,
                target: firstGatewayShape,
                waypoints: [
                    { x: 100, y: 40 },
                    { x: 150, y: 40 },
                ],
            });

            let takeItemAndPerformAction = bpmnElementFactory.createTaskType(
                TaskType.Task,
                {
                    label: 'takeItemAndPerformAction',
                    businessObject: {
                        name: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.TakeItem'),
                    },
                    inputParameters: {},
                    outputParameters: {
                        item: {
                            name: 'item',
                            value: '${environment.services.get(environment.output.list, environment.output.stepIdx)}',
                        },
                    },
                },
                { x: 250, y: 0 },
            );

            const secondConnectionShape = bpmnElementFactory.createSequenceFlow({
                source: firstGatewayShape,
                target: takeItemAndPerformAction,
                waypoints: [
                    { x: 200, y: 40 },
                    { x: 250, y: 40 },
                ],
            });

            const secondGateway = this.bpmnFactory.create('bpmn:ExclusiveGateway');
            secondGateway.label = 'secondGateway';
            const secondGatewayShape = this.elementFactory.createShape({
                type: 'bpmn:ExclusiveGateway',
                businessObject: secondGateway,
                x: 400,
                y: 15,
            });

            const thirdConnectionShape = bpmnElementFactory.createSequenceFlow({
                source: takeItemAndPerformAction,
                target: secondGatewayShape,
                waypoints: [
                    { x: 350, y: 40 },
                    { x: 400, y: 40 },
                ],
            });

            let increment = bpmnElementFactory.createTaskType(
                TaskType.Task,
                {
                    label: 'Increment',
                    businessObject: {
                        name: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Increment'),
                    },
                    inputParameters: {},
                    outputParameters: {
                        stepIdx: {
                            name: 'stepIdx',
                            value: '${environment.services.increment(environment.output.stepIdx)}',
                        },
                    },
                },
                { x: 250, y: 200 },
            );

            const forthConnectionShape = this.elementFactory.createConnection({
                type: 'bpmn:SequenceFlow',
                source: secondGatewayShape,
                target: increment,
                default: true,
                waypoints: [
                    { x: 425, y: 65 },
                    { x: 425, y: 245 },
                    { x: 350, y: 245 },
                ],
            });

            forthConnectionShape.businessObject.name = 'iterate';
            forthConnectionShape.businessObject.conditionExpression = this.bpmnFactory.create('bpmn:FormalExpression', {
                body: '${environment.services.incrementAndCompare(environment.output.stepIdx,environment.output.stepsCount)}',
            });

            const fifthConnectionShape = this.elementFactory.createConnection({
                type: 'bpmn:SequenceFlow',
                source: increment,
                target: firstGatewayShape,
                default: true,
                waypoints: [
                    { x: 250, y: 245 },
                    { x: 175, y: 245 },
                    { x: 175, y: 65 },
                ],
            });

            this.create.start(event, [
                initLoopConfiguration,
                firstGatewayShape,
                firstConnectionShape,
                takeItemAndPerformAction,
                secondConnectionShape,
                secondGatewayShape,
                thirdConnectionShape,
                increment,
                forthConnectionShape,
                fifthConnectionShape,
            ]);

            // const incoming = this.bpmnFactory.create('bpmn:Incoming', null);
            // incoming.$parent = businessObjectGateway;

            // this.commandStack.execute('properties-panel.update-businessobject', {
            //     element: shape,
            //     businessObject: businessObjectGateway,
            //     properties: {incoming: incoming},
            // });

            // console.log("result", result);
        };
    };

    constructor(bpmnFactory, create, elementFactory, palette, translate, commandStack) {
        this.bpmnFactory = bpmnFactory;
        this.create = create;
        this.elementFactory = elementFactory;
        this.translate = translate;
        this.commandStack = commandStack;

        palette.registerProvider(this);
    }

    getPaletteEntries(element) {
        const taskTypes = {
            selenium: this.createScriptServiceTask({
                script: 'selenium',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Selenium'),
                inputParameters: {
                    script: {
                        name: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Selenium.Script'),
                        value: 'selenium',
                    },
                    command: {
                        name: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Selenium.Command'),
                        value: '',
                    },
                    target: {
                        name: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Selenium.Target'),
                        value: '',
                    },
                    value: {
                        name: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Selenium.Value'),
                        value: '',
                    },
                },
                outputParameters: {},
            }),

            write: this.createScriptServiceTask({
                script: 'write',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.WriteToPage'),
                inputParameters: {
                    example: {
                        name: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Example'),
                        type: ParameterType.MAP,
                        value: '',
                        map: {
                            query: '#{XPATH}',
                            value: '#{VALUE}',
                            sendKeys: '${false}',
                        },
                    },
                },
                outputParameters: {},
            }),
            read: this.createScriptServiceTask({
                script: 'read',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.ReadFromPage'),
                inputParameters: {
                    exampleInput: {
                        name: 'exampleInput',
                        type: ParameterType.MAP,
                        value: '',
                        map: {
                            query: '#{XPATH}',
                        },
                    },
                },
                outputParameters: {
                    exampleOutput: {
                        name: 'exampleOutput',
                        value: '${content.output[0].exampleInput.value}',
                    },
                },
            }),
            click: this.createScriptServiceTask({
                script: 'click',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Click'),
                inputParameters: {
                    script: {
                        name: 'script',
                        value: 'click',
                    },
                    xpath: {
                        name: 'xpath',
                        value: '${XPATH}',
                    },
                },
                outputParameters: {},
            }),
            waitAndClick: this.createScriptServiceTask({
                script: 'waitAndClick',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.WaitClick'),
                inputParameters: {
                    script: {
                        name: 'script',
                        value: 'waitAndClick',
                    },
                    xpath: {
                        name: 'xpath',
                        value: '${XPATH}',
                    },
                },
                outputParameters: {},
            }),
            redirect: this.createScriptServiceTask({
                script: 'redirect',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Redirect'),
                inputParameters: {
                    script: {
                        name: 'script',
                        value: 'redirect',
                    },
                    xpath: {
                        name: 'url',
                        value: '#{URL}',
                    },
                },
                outputParameters: {},
            }),
            wait: this.createScriptServiceTask({
                script: 'wait',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Wait'),
                inputParameters: {
                    script: {
                        name: 'script',
                        value: 'wait',
                    },
                    xpath: {
                        name: 'xpath',
                        value: '#{XPATH}',
                    },
                },
                outputParameters: {},
            }),

            storageWrite: this.createBackgroundServiceTask({
                script: 'storage.write',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.StoreToStorage'),
                inputParameters: {
                    key: {
                        name: 'key',
                        value: '#{exampleKey}',
                    },
                    value: {
                        name: 'value',
                        value: '#{exampleValue}',
                    },
                },
                outputParameters: {},
            }),
            storageRead: this.createBackgroundServiceTask({
                script: 'storage.read',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.ReadFromStorage'),
                inputParameters: {
                    key: {
                        name: 'key',
                        value: '#{exampleKey}',
                    },
                },
                outputParameters: {
                    exampleOutput: {
                        name: 'exampleOutput',
                        value: '${content.output[0]}',
                    },
                },
            }),
            decisionSignal: this.createManualTask({
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.DecisionSignal'),
                inputParameters: {
                    component: {
                        name: 'component',
                        value: 'DecisionSignal',
                    },
                    title: {
                        name: 'title',
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.ApprovalRequired'),
                    },
                    message: {
                        name: 'message',
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.ApprovalRequired.ConfirmationMsg'),
                    },
                    decisions: {
                        name: 'decisions',
                        type: ParameterType.MAP,
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.ApprovalRequired.ConfirmationDecision'),
                        map: {
                            YES: t('Common.Yes'),
                            NO: t('Common.No'),
                        },
                    },
                },
                outputParameters: {
                    decision: {
                        name: 'decision',
                        value: '${content.output.decision}',
                    },
                },
            }),

            popover: this.createManualTask({
                label: 'PopoverManualTask',
                inputParameters: {
                    component: {
                        name: 'component',
                        value: 'PopoverManualTask',
                    },
                    xpath: {
                        name: 'xpath',
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.XPathOfElement'),
                    },
                    title: {
                        name: 'title',
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.WindowTitle'),
                    },
                    message: {
                        name: 'message',
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.Decision.Message'),
                    },
                    decisions: {
                        name: 'decisions',
                        type: ParameterType.MAP,
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.OptionsForUser'),
                        map: {
                            YES: t('Common.Yes'),
                            NO: t('Common.No'),
                        },
                    },
                },
                outputParameters: {
                    decision: {
                        name: 'decision',
                        value: '${content.output.decision}',
                    },
                },
            }),

            formSignal: this.createManualTask({
                label: 'FormManualTask',
                inputParameters: {
                    component: {
                        name: 'component',
                        value: 'FormManualTask',
                    },
                    title: {
                        name: 'title',
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.DataInput'),
                    },
                    fields: {
                        name: 'fields',
                        type: ParameterType.MAP,
                        value: '',
                        map: {
                            ExampleField: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.ExampleField'),
                        },
                    },
                    defaultValues: {
                        name: 'defaultValues',
                        type: ParameterType.MAP,
                        value: '',
                        map: {
                            ExampleField: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.ExampleValue'),
                        },
                    },
                },
                outputParameters: {
                    exampleOutput: {
                        name: 'exampleOutput',
                        value: '${content.output.ExampleField}',
                    },
                },
            }),
            NotificationManualTask: this.createManualTask({
                label: 'NotificationManualTask',
                inputParameters: {
                    component: {
                        name: 'component',
                        value: 'NotificationManualTask',
                    },
                    message: {
                        name: 'message',
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.ExampleMessage'),
                    },
                    decisions: {
                        name: 'decisions',
                        type: ParameterType.MAP,
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.ApprovalRequired.ConfirmationMsg'),
                        map: {
                            YES: t('Common.Yes'),
                            NO: t('Common.No'),
                        },
                    },
                },
                outputParameters: {
                    decision: {
                        name: 'decision',
                        value: '${content.output.decision}',
                    },
                },
            }),

            backgroundScript: this.createBackgroundServiceTask({
                script: 'backgroundScript',
                label: 'bpScript',
                inputParameters: {},
                outputParameters: {},
            }),
            startProcess: this.createBackgroundServiceTask({
                script: 'startProcess',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.StartProcess'),
                inputParameters: {
                    name: {
                        name: 'name',
                        value: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.StartProcess.Name'),
                    },
                },
                outputParameters: {},
            }),
            startThread: this.createBackgroundServiceTask({
                script: 'startThread',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.StartThread'),
                inputParameters: {},
                outputParameters: {},
            }),
            endThread: this.createBackgroundServiceTask({
                script: 'endThread',
                label: t('Process.Details.Modeler.Extensions.Tasks.CustomPalette.EndThread'),
                inputParameters: {},
                outputParameters: {},
            }),
            createFor: this.createFor(),
            mailSend: this.createBackgroundServiceTask({
                script: 'mail.send',
                label: 'mail.send',
                inputParameters: {
                    to: {
                        name: 'to',
                        value: '${example@example.com}',
                    },
                    subject: {
                        name: 'subject',
                        value: '#{subject}',
                    },
                    content: {
                        name: 'content',
                        value: '#{content}',
                    },
                },
                outputParameters: {},
            }),
        };

        return {
            'actions-separator': {
                group: 'actions',
                separator: true,
            },

            'create.write': {
                group: 'actions',
                className: 'bpmn-icon write',
                title: this.translate('Create Write Task'),
                action: {
                    dragstart: taskTypes.write,
                    click: taskTypes.write,
                },
            },
            'create.read': {
                group: 'actions',
                className: 'bpmn-icon read',
                title: this.translate('Create Read Task'),
                action: {
                    dragstart: taskTypes.read,
                    click: taskTypes.read,
                },
            },
            'script.click': {
                group: 'actions',
                className: 'bpmn-icon click',
                title: this.translate('Click Task'),
                action: {
                    dragstart: taskTypes.click,
                    click: taskTypes.click,
                },
            },
            'script.waitAndClick': {
                group: 'actions',
                className: 'bpmn-icon waitAndClick',
                title: this.translate('Wait and click Task'),
                action: {
                    dragstart: taskTypes.waitAndClick,
                    click: taskTypes.waitAndClick,
                },
            },
            'create.redirect': {
                group: 'actions',
                className: 'bpmn-icon redirect',
                title: this.translate('Redirect to URL'),
                action: {
                    dragstart: taskTypes.redirect,
                    click: taskTypes.redirect,
                },
            },
            'create.wait': {
                group: 'actions',
                className: 'bpmn-icon wait',
                title: this.translate('Wait for url / xpath'),
                action: {
                    dragstart: taskTypes.wait,
                    click: taskTypes.wait,
                },
            },

            'script.selenium': {
                group: 'actions',
                className: 'bpmn-icon selenium',
                title: this.translate('selenium'),
                action: {
                    dragstart: taskTypes.selenium,
                    click: taskTypes.selenium,
                },
            },
            'manualTasks-separator': {
                group: 'manualTasks',
                separator: true,
            },
            'manualTasks.decision': {
                group: 'manualTasks',
                className: 'bpmn-icon decision-signal',
                title: this.translate('Create Decision'),
                action: {
                    dragstart: taskTypes.decisionSignal,
                    click: taskTypes.decisionSignal,
                },
            },
            'manualTasks.popover': {
                group: 'manualTasks',
                className: 'bpmn-icon popover-signal',
                title: this.translate('Create Popover'),
                action: {
                    dragstart: taskTypes.popover,
                    click: taskTypes.popover,
                },
            },
            'manualTasks.formSignal': {
                group: 'manualTasks',
                className: 'bpmn-icon form-signal',
                title: this.translate('Form'),
                action: {
                    dragstart: taskTypes.formSignal,
                    click: taskTypes.formSignal,
                },
            },

            'manualTasks.NotificationManualTask': {
                group: 'manualTasks',
                className: 'bpmn-icon NotificationManualTask',
                title: this.translate('Form'),
                action: {
                    dragstart: taskTypes.NotificationManualTask,
                    click: taskTypes.NotificationManualTask,
                },
            },

            'backgroundScripts-separator': {
                group: 'backgroundScripts',
                separator: true,
            },
            'backgroundScripts.backgroundScript': {
                group: 'backgroundScripts',
                className: 'bpmn-icon backgroundScript',
                title: this.translate('Create background script task'),
                action: {
                    dragstart: taskTypes.backgroundScript,
                    click: taskTypes.backgroundScript,
                },
            },
            'backgroundScripts.start-process': {
                group: 'backgroundScripts',
                className: 'bpmn-icon start-process',
                title: this.translate('Create Start Process Task'),
                action: {
                    dragstart: taskTypes.startProcess,
                    click: taskTypes.startProcess,
                },
            },
            'backgroundScripts.startThread': {
                group: 'backgroundScripts',
                className: 'bpmn-icon startThread',
                title: this.translate('Start seperate thread'),
                action: {
                    dragstart: taskTypes.startThread,
                    click: taskTypes.startThread,
                },
            },
            'backgroundScripts.endThread': {
                group: 'backgroundScripts',
                className: 'bpmn-icon endThread',
                title: this.translate('End seperate thread'),
                action: {
                    dragstart: taskTypes.endThread,
                    click: taskTypes.endThread,
                },
            },
            'script.storage.read': {
                group: 'backgroundScripts',
                className: 'bpmn-icon storage-read',
                title: this.translate('Read from storage'),
                action: {
                    dragstart: taskTypes.storageRead,
                    click: taskTypes.storageRead,
                },
            },
            'script.storage.write': {
                group: 'backgroundScripts',
                className: 'bpmn-icon storage-write',
                title: this.translate('Write to storage'),
                action: {
                    dragstart: taskTypes.storageWrite,
                    click: taskTypes.storageWrite,
                },
            },
            'backgroundScripts.mail.send': {
                group: 'backgroundScripts',
                className: 'bpmn-icon mailSend',
                title: this.translate('Write to storage'),
                action: {
                    dragstart: taskTypes.mailSend,
                    click: taskTypes.mailSend,
                },
            },
            'general-separator': {
                group: 'general',
                separator: true,
            },
            'general.for': {
                group: 'general',
                className: 'bpmn-icon for',
                title: this.translate('for'),
                action: {
                    dragstart: taskTypes.createFor,
                    click: taskTypes.createFor,
                },
            },
        };
    }
}

// @ts-ignore
CustomPalette.$inject = ['bpmnFactory', 'create', 'elementFactory', 'palette', 'translate', 'commandStack'];
