// eslint-disable-next-line max-classes-per-file
import BpmnModeler from 'bpmn-js/lib/Modeler';
import { JSONSchema7Definition } from 'json-schema';
import { ActionCredentialType, BpmnElementType, Expressions } from 'runbotics-common';

interface CamundaEntry {
    $type: 'camunda:Entry';
    key: string;
    value: string;
}

interface CamundaValue {
    $type: 'camunda:Value';
    value: string;
}

interface CamundaParameterDefinition {
    $type: 'camunda:List' | 'camunda:Map';
    items: CamundaValue[];
}

type CamundaMapParameterDefinition = CamundaParameterDefinition & {
    $type: 'camunda:Map';
    entries?: CamundaEntry[];
};

export type CamundaParameter = {
    $type: 'camunda:InputParameter' | 'camunda:OutputParameter';
    $attrs?: {
        type: string;
    };
    name: string;
    value: string;
    definition?: CamundaParameterDefinition;
};

export type CamundaInputParameter = CamundaParameter & {
    $type: 'camunda:InputParameter';
    name: string;
    value: string;
};

export type CamundaOutputParameter = CamundaParameter & {
    $type: 'camunda:OutputParameter';
    name: string;
    value: string;
};

enum ExtensionElementType {
    'camunda:InputOutput' = 'camunda:InputOutput',
}

export type ExtensionElement = {
    $type: ExtensionElementType;
    name: string;
    value: string;
};

export type CamundaInputOutputElement = ExtensionElement & {
    inputParameters: CamundaInputParameter[];
    outputParameters: CamundaOutputParameter[];
};

export type ExtensionElements = {
    $type: string;
    values: CamundaInputOutputElement[];
};

export type BusinessObject = {
    name: JSONSchema7Definition;
    $type: 'bpmn:SequenceFlow';
    actionId: string;
    disabled: boolean;
    runFromHere: boolean;
    credentialType: ActionCredentialType;
    processOutput: boolean;
    label: string;
    extensionElements?: ExtensionElements;
    runbotics?: string;
    validationError?: boolean;
    customValidationError?: boolean;
};

export type IBpmnGatewayBusinessObject = Pick<BusinessObject, '$type' | 'disabled' | 'runFromHere' | 'processOutput'> & {
    default?: IBpmnConnection;
    incoming?: Pick<ModdleElement, '$type' | 'id'>;
    outgoing?: ISequenceFlowBusinessObject;
};

export type ModdleElement = {
    $type: string,
    actionId: string,
    extensionElements?: ExtensionElement[],
    id: string,
    implementation: string,
    label: string
    flowElements?: ModdleElement[],
};

export type BPMNElement = {
    id: string;
    type: BpmnElementType;
    businessObject: BusinessObject;
    incoming?: IBpmnConnection[];
    outgoing?: IBpmnConnection[];
    parent?: BPMNElement;
    host?: BPMNElement;
    attachers?: BPMNElement[];
};

export interface BPMNElementRegistry {
    [key: BPMNElement['id']]: {
        element: BPMNElement;
        gfx: unknown;
        secondaryGfx: unknown;
    }
}

export type BpmnFormalExpression = {
    $type: 'bpmn:FormalExpression';
    body: string;
};

export type ISequenceFlowBusinessObject = {
    $type: 'bpmn:SequenceFlow';
    conditionExpression?: BpmnFormalExpression;
};

export type IBpmnConnection = BPMNElement & {
    businessObject: ISequenceFlowBusinessObject;
    source?: BPMNElement;
};

export type IBpmnGateway = BPMNElement & {
    businessObject: IBpmnGatewayBusinessObject;
};

export type IBpmnSubProcessBusinessObject = BusinessObject & {
    loopCharacteristics: Record<string, any>;
};

export type BpmnSubProcess = BPMNElement & {
    businessObject: IBpmnSubProcessBusinessObject;
};

export const getParameterValue = (parameter: CamundaParameter) => {
    if (parameter.$attrs && parameter.$attrs.type === 'Boolean') {
        const result = Expressions.resolveExpression(parameter.value, {}, {});

        return result;
    }
    if (parameter.$attrs && parameter.$attrs.type === 'Number') {
        const result = Expressions.resolveExpression(parameter.value, {}, {});
        return result;
    }

    if (!parameter.definition) {
        return parameter.value;
    }

    switch (parameter.definition.$type) {
        case 'camunda:List':
            return parameter.definition.items.map((item) => item.value);
        case 'camunda:Map':
            const map = parameter.definition as CamundaMapParameterDefinition;
            if (!map.entries) {
                return {};
            }

            return map.entries.reduce((previousValue, currentValue) => {
                const newPrev = previousValue;
                newPrev[currentValue.key] = currentValue.value;
                return newPrev;
            }, {});
        default:
            return null;
    }
};

export const getInputParameters = (
    element: BPMNElement
): Record<string, any> => {
    const inputOutputElement = element.businessObject?.extensionElements
        ?.values[0] as CamundaInputOutputElement;
    if (!inputOutputElement) {
        return {};
    }

    return inputOutputElement.inputParameters.reduce(
        (previousValue, currentValue) => {
            const newPrev = previousValue;
            newPrev[currentValue.name] = getParameterValue(currentValue);
            return newPrev;
        },
        {}
    );
};

export const getOutputParameters = (
    element: BPMNElement
): Record<string, any> => {
    const inputOutputElement = element.businessObject?.extensionElements
        ?.values[0] as CamundaInputOutputElement;
    if (!inputOutputElement || !inputOutputElement.outputParameters) {
        return {};
    }

    return inputOutputElement.outputParameters.reduce(
        (previousValue, currentValue) => {
            const newPrev = previousValue;
            newPrev[currentValue.name] = getParameterValue(currentValue);
            return newPrev;
        },
        {}
    );
};

const findPreviousElement = (element: BPMNElement, array: BPMNElement[]) => {
    if (element.incoming && element.incoming.length > 0) {
        const connection = element.incoming[0];
        if (connection.source) {
            array.push(connection.source);
            findPreviousElement(connection.source, array);
        }
    }
};

export const findPreviousElements = (element: BPMNElement): BPMNElement[] => {
    const found = [];
    findPreviousElement(element, found);
    return found;
};

export class BpmnConnectionFactory {
    private bpmnFactory: any;

    private elementFactory: any;

    private commandStack: any;
    private modeling: any;

    constructor(bpmnFactory: any, elementFactory: any, commandStack: any, modeling: any) {
        this.bpmnFactory = bpmnFactory;
        this.elementFactory = elementFactory;
        this.commandStack = commandStack;
        this.modeling = modeling;
    }

    static from(modeler: BpmnModeler) {
        return new BpmnConnectionFactory(
            modeler.get('bpmnFactory'),
            modeler.get('elementFactory'),
            modeler.get('commandStack'),
            modeler.get('modeling')
        );
    }

    setConditionExpression(connection: IBpmnConnection, expression: string) {
        const FormalExpression = this.bpmnFactory.create(
            'bpmn:FormalExpression',
            {
                body: expression,
            }
        );
        FormalExpression.$parent = connection.businessObject;

        this.commandStack.execute('properties-panel.update-businessobject', {
            element: connection,
            businessObject: connection.businessObject,
            properties: { conditionExpression: FormalExpression },
        });
    }

    setConnectionColor(connection: IBpmnConnection, color: string) {
        this.modeling.setColor(connection, { stroke: color });
    }

    setConnectionName(connection: IBpmnConnection, name: string) {
        this.modeling.updateProperties(connection, { name });
    }

    setDefaultConnection(connection: IBpmnConnection, gateway: IBpmnGateway) {
        this.modeling.updateProperties(gateway, { default: connection });
    }

    setGatewayName(gateway: IBpmnGateway, name: string) {
        this.modeling.updateProperties(gateway, { name });
    }
}

export class BPMNHelper {
    private bpmnFactory: any;

    private elementFactory: any;

    private commandStack: any;

    constructor(bpmnFactory: any, elementFactory: any, commandStack: any) {
        this.bpmnFactory = bpmnFactory;
        this.elementFactory = elementFactory;
        this.commandStack = commandStack;
    }

    static from(modeler: BpmnModeler) {
        return new BPMNHelper(
            modeler.get('bpmnFactory'),
            modeler.get('elementFactory'),
            modeler.get('commandStack')
        );
    }

    updateBusinessObject(element: BPMNElement) {
        this.commandStack.execute('properties-panel.update-businessobject', {
            element,
            businessObject: element.businessObject,
        });
    }
}
