import {
    BPMNElement,
    CamundaInputParameter,
    CamundaOutputParameter,
    CamundaParameter,
    IBpmnGateway,
    IBpmnSubProcessBusinessObject,
    ISequenceFlowBusinessObject,
    getParameterValue
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

export const findVariablesInGateway = (businessObject: IBpmnGateway, searchPhrase: string): boolean => {
    const gatewayOutgoingFlows: ISequenceFlowBusinessObject[] = businessObject.outgoing as unknown as ISequenceFlowBusinessObject[];

    const gatewayExpressions = gatewayOutgoingFlows
        .map(flow => flow.conditionExpression.body.toLowerCase())
        .filter(expression => expression.includes(searchPhrase));

    return gatewayExpressions.length > 0;
};

export const findVariablesInLoop = (element: BPMNElement, searchPhrase: string): boolean => {
    const loopVariable = (element.businessObject as IBpmnSubProcessBusinessObject).loopCharacteristics.loopCardinality.body;
    return loopVariable.toLowerCase().includes(searchPhrase);
};
export const findVariablesInAction = (element: BPMNElement, searchPhrase: string): boolean => {
    let variableFound = false;
    const extensionElements = element.businessObject.extensionElements;

    if (!extensionElements) {
        return false;
    }

    const inputValues = extensionElements.values[0].inputParameters;
    const outputValues = extensionElements.values[0].outputParameters;

    if (inputValues && inputValues.length > 0) {
        const inputVariable = inputValues.filter(
            value =>
                (value.name === 'variable' && value.value.toLowerCase().includes(searchPhrase)) ||
                (value.name === 'value' &&
                    (value.value.startsWith('#{') || value.value.startsWith('${')) &&
                    value.value.toLowerCase().includes(searchPhrase))
        );

        const hashVariables = findHashDollarVariable(inputValues, searchPhrase);
            
        variableFound = [...inputVariable, ...hashVariables].length > 0;
    }

    if (variableFound) {
        return variableFound;
    }

    if (outputValues && outputValues.length > 0) {
        const outputVariable = outputValues.filter(
            value => value.name === 'variableName' && value.value.toLowerCase().includes(searchPhrase)
        );

        const hashVariables = findHashDollarVariable(outputValues, searchPhrase);

        variableFound = [...outputVariable, ...hashVariables].length > 0;
    }

    return false;
};

const findHashDollarVariable = (extensionElementValues: CamundaInputParameter[] | CamundaOutputParameter[], searchPhrase: string) =>
    extensionElementValues
        .filter(value => value.name === 'variables' || value.name === 'functionParams')
        .map((camundaParam: CamundaParameter) => Object.values(getParameterValue(camundaParam)))
        .flatMap(arr => arr)
        .filter((foundValue: string) => foundValue.toLowerCase().includes(searchPhrase));
