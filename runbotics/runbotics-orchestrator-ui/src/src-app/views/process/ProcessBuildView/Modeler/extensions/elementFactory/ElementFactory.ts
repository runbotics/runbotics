/* eslint-disable eqeqeq */
import BpmnModeler from 'bpmn-js/lib/Modeler';

import { Position } from '#src-app/views/process/ProcessBuildView/Modeler/ConfigureActionPanel/Template.types';

import {
    Parameter,
    ParameterDestination,
    ParameterList,
    ParameterMap,
    ParameterType,
    TaskConfiguration,
} from '../palette/CustomPalette';

export enum TaskType {
    'ServiceTask' = 'ServiceTask',
    'ManualTask' = 'ManualTask',
    'Task' = 'Task',
    'SubProcess' = 'SubProcess',
}

export type ISeleniumTask = {
    command: string;
    target?: any;
    value?: any;
};

export class BPMNElementFactory {
    private bpmnFactory: any;

    private elementFactory: any;

    private commandStack: any;

    constructor(bpmnFactory: any, elementFactory: any, commandStack: any) {
        this.bpmnFactory = bpmnFactory;
        this.elementFactory = elementFactory;
        this.commandStack = commandStack;
    }

    static from(modeler: BpmnModeler) {
        return new BPMNElementFactory(
            modeler.get('bpmnFactory'),
            modeler.get('elementFactory'),
            modeler.get('commandStack'),
        );
    }

    createTaskType = (type: TaskType, configuration: TaskConfiguration, additionalShapeAttrs?: Record<string, any>) => {
        const businessObject = this.bpmnFactory.create(`bpmn:${type}`);
        if (configuration.businessObject) {
            Object.entries(configuration.businessObject).forEach(([key, value]) => {
                businessObject[key] = value;
            });
        }

        businessObject.label = configuration.label;
        const shape = this.elementFactory.createShape({
            type: `bpmn:${type}`,
            businessObject,
            ...additionalShapeAttrs,
        });

        const extensionElements = this.bpmnFactory.create('bpmn:ExtensionElements', null);
        extensionElements.$parent = businessObject;

        this.commandStack.execute('properties-panel.update-businessobject', {
            element: shape,
            businessObject,
            properties: { extensionElements },
        });

        const inputOutput = this.bpmnFactory.create('camunda:InputOutput', null);
        inputOutput.$parent = businessObject;

        this.commandStack.execute('properties-panel.update-businessobject-list', {
            element: shape,
            currentObject: extensionElements,
            propertyName: 'values',
            objectsToPrepend: null,
            objectsToAdd: inputOutput,
        });

        const createParameter = (destination: ParameterDestination, parameter: Parameter) => {
            if (parameter.type == null || parameter.type === ParameterType.TEXT) {
                return this.bpmnFactory.create(`camunda:${destination}Parameter`, {
                    name: parameter.name,
                    value: parameter.value,
                });
            }
            if (parameter.type === ParameterType.MAP) {
                const parameterMap = parameter as ParameterMap;
                return this.bpmnFactory.create(`camunda:${destination}Parameter`, {
                    name: parameter.name,
                    definition: this.bpmnFactory.create('camunda:Map', {
                        entries: Object
                            .entries(parameterMap.map)
                            .map(([key, value]) => this.bpmnFactory.create('camunda:Entry', { key, value })),
                    }),
                });
            } if (parameter.type === ParameterType.LIST) {
                const parameterList = parameter as ParameterList;
                return this.bpmnFactory.create(`camunda:${destination}Parameter`, {
                    name: parameter.name,
                    definition: this.bpmnFactory.create('camunda:List', {
                        items: parameterList.list.map((value) => this.bpmnFactory.create('camunda:Value', {
                            value,
                        })),
                    }),
                });
            }
            return undefined;
        };

        this.commandStack.execute('properties-panel.update-businessobject-list', {
            element: shape,
            currentObject: inputOutput,
            propertyName: 'inputParameters',
            referencePropertyName: null,
            objectsToAdd: Object
                .values(configuration.inputParameters)
                .map((inputParameter) => createParameter(ParameterDestination.Input, inputParameter)),
            objectsToRemove: [],
        });

        this.commandStack.execute('properties-panel.update-businessobject-list', {
            element: shape,
            currentObject: inputOutput,
            propertyName: 'outputParameters',
            referencePropertyName: null,
            objectsToAdd: Object
                .values(configuration.outputParameters)
                .map((outputParameter) => createParameter(ParameterDestination.Output, outputParameter)),
            objectsToRemove: [],
        });

        return shape;
    };

    public createSequenceFlow(payload: { source: any; target: any; waypoints: Position[], default?: boolean }) {
        return this.elementFactory.createConnection({
            type: 'bpmn:SequenceFlow',
            source: payload.source,
            target: payload.target,
            waypoints: payload.waypoints,
            default: payload.default ? payload.default : false,
        });
    }

}
