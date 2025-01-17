import BpmnModeler from 'bpmn-js/lib/Modeler';
import { JSONSchema7 } from 'json-schema';
import _ from 'lodash';

import { translate } from '#src-app/hooks/useTranslations';

import { IBpmnAction } from '../../../../../Actions/types';
import {
    Parameter,
    ParameterDestination,
    ParameterList,
    ParameterMap,
    ParameterType
} from '../extensions/palette/CustomPalette';
import {
    BPMNElement,
    CamundaInputOutputElement
} from '../helpers/elementParameters';


export enum TaskType {
    'ServiceTask' = 'ServiceTask',
    'ManualTask' = 'ManualTask',
    'Task' = 'Task',
    'SubProcess' = 'SubProcess'
}

export type ISeleniumTask = {
    command: string;
    target?: any;
    value?: any;
};

export class ActionToBPMNElement {
    private bpmnFactory: any;

    private elementFactory: any;

    private commandStack: any;

    constructor(bpmnFactory: any, elementFactory: any, commandStack: any) {
        this.bpmnFactory = bpmnFactory;
        this.elementFactory = elementFactory;
        this.commandStack = commandStack;
    }

    static from(modeler: BpmnModeler) {
        return new ActionToBPMNElement(
            modeler.get('bpmnFactory'),
            modeler.get('elementFactory'),
            modeler.get('commandStack')
        );
    }

    formDataToParameters = (
        destination: ParameterDestination,
        data: Record<string, any>,
        schema?: JSONSchema7
    ): Parameter[] =>
        Object.entries(data).map(([key, value]) => {
            const parameter = {
                name: key,
                value,
                type: null
            };
            let field = _.get(
                schema,
                `properties.${destination.toLowerCase()}.properties.${key}`
            ) as JSONSchema7;
            if (!field) {
                const oneOf = _.get(
                    schema,
                    `properties.${destination.toLowerCase()}.oneOf`
                ) as JSONSchema7;
                if (oneOf && Array.isArray(oneOf)) {
                    const array = oneOf as any[];
                    const selectedList = array.filter(element => {
                        const found = Object.keys(data).some(elementKey =>
                            _.get(element, `properties.${elementKey}`)
                        );
                        return found;
                    });
                    if (selectedList.length > 0) {
                        const selected = selectedList[0];
                        field = _.get(
                            selected,
                            `properties.${key}`
                        ) as JSONSchema7;
                    }
                }
            }

            if (field && field.type) {
                switch (field.type) {
                    case 'array':
                        parameter.type = ParameterType.LIST;
                        break;
                    case 'boolean':
                        parameter.value = `\${${value}}`;
                        parameter.type = ParameterType.Boolean;
                        break;
                    case 'object':
                        parameter.type = ParameterType.MAP;
                        break;
                    case 'number':
                        parameter.value = `\${${value}}`;
                        parameter.type = ParameterType.Number;
                        break;
                    default:
                        parameter.type = ParameterType.TEXT;
                        break;
                }
            } else {
                parameter.type = ParameterType.TEXT;
            }

            return this.createParameter(destination, parameter);
        });

    createParameter = (
        destination: ParameterDestination,
        parameter: Parameter
    ) => {
        // eslint-disable-next-line eqeqeq
        if (parameter.type == null || parameter.type === ParameterType.TEXT) {
            return this.bpmnFactory.create(`camunda:${destination}Parameter`, {
                name: parameter.name,
                value: parameter.value
            });
        }
        if (parameter.type === ParameterType.Number) {
            return this.bpmnFactory.create(`camunda:${destination}Parameter`, {
                name: parameter.name,
                value: parameter.value,
                type: ParameterType.Number
            });
        }
        if (parameter.type === ParameterType.Boolean) {
            return this.bpmnFactory.create(`camunda:${destination}Parameter`, {
                name: parameter.name,
                value: parameter.value,
                type: ParameterType.Boolean
            });
        }
        if (parameter.type === ParameterType.MAP) {
            const parameterMap = parameter as ParameterMap;
            return this.bpmnFactory.create(`camunda:${destination}Parameter`, {
                name: parameter.name,
                definition: this.bpmnFactory.create('camunda:Map', {
                    entries: Object.entries(parameterMap.value).map(
                        ([key, value]) =>
                            this.bpmnFactory.create('camunda:Entry', {
                                key,
                                value
                            })
                    )
                })
            });
        }
        if (parameter.type === ParameterType.LIST) {
            const parameterList = parameter as ParameterList;
            return this.bpmnFactory.create(`camunda:${destination}Parameter`, {
                name: parameter.name,
                definition: this.bpmnFactory.create('camunda:List', {
                    items: parameterList.value.map(value =>
                        this.bpmnFactory.create('camunda:Value', {
                            value: value?.toString()
                        })
                    )
                })
            });
        }
        return undefined;
    };

    setInputParameters = (element: BPMNElement, parameters: Parameter[]) => {
        if (!element.businessObject.extensionElements) {
            const extensionElements = this.bpmnFactory.create(
                'bpmn:ExtensionElements',
                null
            );
            extensionElements.$parent = element.businessObject;

            this.commandStack.execute(
                'properties-panel.update-businessobject',
                {
                    element,
                    businessObject: element.businessObject,
                    properties: { extensionElements }
                }
            );

            const inputOutput = this.bpmnFactory.create(
                'camunda:InputOutput',
                null
            );
            inputOutput.$parent = element.businessObject;

            this.commandStack.execute(
                'properties-panel.update-businessobject-list',
                {
                    element,
                    currentObject: extensionElements,
                    propertyName: 'values',
                    objectsToPrepend: null,
                    objectsToAdd: inputOutput
                }
            );
        }

        const camundaInputOutputElement: CamundaInputOutputElement = element
            .businessObject.extensionElements
            .values[0] as CamundaInputOutputElement;

        this.commandStack.execute(
            'properties-panel.update-businessobject-list',
            {
                element,
                currentObject: camundaInputOutputElement,
                propertyName: 'inputParameters',
                referencePropertyName: null,
                objectsToAdd: parameters,
                objectsToRemove: [...camundaInputOutputElement.inputParameters]
            }
        );
    };

    setOutputParameters = (element: BPMNElement, parameters: Parameter[]) => {
        const camundaInputOutputElement: CamundaInputOutputElement = element
            .businessObject.extensionElements
            .values[0] as CamundaInputOutputElement;
        const request = {
            element,
            currentObject: camundaInputOutputElement,
            propertyName: 'outputParameters',
            referencePropertyName: null,
            objectsToAdd: parameters,
            objectsToRemove: camundaInputOutputElement.outputParameters
                ? [...camundaInputOutputElement.outputParameters]
                : []
        };
        this.commandStack.execute(
            'properties-panel.update-businessobject-list',
            request
        );
    };

    // eslint-disable-next-line max-params
    createElement = (
        type: TaskType,
        action: IBpmnAction,
        properties?: Record<string, any>,
        shapeProperties?: Record<string, any>
    ) => {
        const businessObject = this.bpmnFactory.create(
            `bpmn:${type}`,
            properties
        );
        businessObject.label =
            action.id && action.id.slice(0, 8) !== 'external'
                ? ''
                : `${translate('Process.Details.Modeler.ActionsGroup.External')}: ${action.label}`;
        businessObject.implementation = action.runner;
        businessObject.validationError = false;
        businessObject.actionId = action.id;
        businessObject.credentialType = action?.credentialType;

        const shape = this.elementFactory.createShape({
            type: `bpmn:${type}`,
            businessObject,
            ...shapeProperties
        });

        const extensionElements = this.bpmnFactory.create(
            'bpmn:ExtensionElements',
            null
        );
        extensionElements.$parent = businessObject;

        this.commandStack.execute('properties-panel.update-businessobject', {
            element: shape,
            businessObject,
            properties: { extensionElements }
        });

        const inputOutput = this.bpmnFactory.create(
            'camunda:InputOutput',
            null
        );
        inputOutput.$parent = businessObject;

        this.commandStack.execute(
            'properties-panel.update-businessobject-list',
            {
                element: shape,
                currentObject: extensionElements,
                propertyName: 'values',
                objectsToPrepend: null,
                objectsToAdd: inputOutput
            }
        );

        const inputFields = {
            ...action.form.formData.input
        };
        if (action.script) inputFields.script = action.script;
        if (action.credentialType) inputFields.credentialType = action.credentialType;

        this.commandStack.execute(
            'properties-panel.update-businessobject-list',
            {
                element: shape,
                currentObject: inputOutput,
                propertyName: 'inputParameters',
                referencePropertyName: null,
                objectsToAdd: Object.entries(inputFields).map(
                    ([key, value]) => {
                        const parameter = {
                            name: key,
                            value,
                            type: null
                        };

                        return this.createParameter(
                            ParameterDestination.Input,
                            parameter
                        );
                    }
                ),
                objectsToRemove: []
            }
        );

        if (action.form.formData.output) {
            this.commandStack.execute(
                'properties-panel.update-businessobject-list',
                {
                    element: shape,
                    currentObject: inputOutput,
                    propertyName: 'outputParameters',
                    referencePropertyName: null,
                    objectsToAdd: Object.entries(action.form.formData.output)
                        .filter(
                            ([key]) =>
                                !(
                                    action.output &&
                                    action.output.outputMethods[key]
                                )
                        )
                        .map(([key, value]) => {
                            const parameter = {
                                name: key,
                                value,
                                type: null
                            };
                            if (action.form && action.form.schema) {
                                const { schema } = action.form;
                                const field = _.get(
                                    schema,
                                    `properties.output.properties.${key}`
                                ) as JSONSchema7;
                                if (field && field.type) {
                                    switch (field.type) {
                                        case 'array':
                                            parameter.type = ParameterType.LIST;
                                            break;
                                        default:
                                            parameter.type = ParameterType.TEXT;
                                            break;
                                    }
                                }
                            }

                            return this.createParameter(
                                ParameterDestination.Output,
                                parameter
                            );
                        }),
                    objectsToRemove: []
                }
            );
        }

        return shape;
    };
}
