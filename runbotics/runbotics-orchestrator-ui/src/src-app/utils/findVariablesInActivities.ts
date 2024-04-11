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
    const extensionElements = element.businessObject.extensionElements;

    if (!extensionElements) return false;

    const inputValues = extensionElements.values[0].inputParameters;
    const outputValues = extensionElements.values[0].outputParameters;

    if (
        (inputValues && inputValues.length > 0 && findInputVariablesInAction(inputValues, searchPhrase)) ||
        (outputValues && outputValues.length > 0 && findOutputVariablesInAction(outputValues, searchPhrase))
    ) {
        return true;
    }

    return false;
};

const findInputVariablesInAction = (inputValues: CamundaInputParameter[], searchPhrase: string) => {
    const inputVariable = inputValues.filter(
        value =>
            (value.name === 'variable' && value.value.toLowerCase().includes(searchPhrase)) ||
            (value.name === 'value' &&
                value.value &&
                (value.value.startsWith('#{') || value.value.startsWith('${')) &&
                value.value.toLowerCase().includes(searchPhrase))
    );

    const hashVariables = findHashDollarVariable(inputValues, searchPhrase);

    return [...inputVariable, ...hashVariables].length > 0;
};

const findOutputVariablesInAction = (outputValues: CamundaOutputParameter[], searchPhrase: string) => {
    const outputVariable = outputValues.filter(
        value => value.name === 'variableName' && value.value && value.value.toLowerCase().includes(searchPhrase)
    );

    const hashVariables = findHashDollarVariable(outputValues, searchPhrase);

    return [...outputVariable, ...hashVariables].length > 0;
};

const findHashDollarVariable = (extensionElementValues: CamundaParameter[], searchPhrase: string) =>
    extensionElementValues
        .filter(value => value.name === 'variables' || value.name === 'functionParams')
        .map((camundaParam: CamundaParameter) => Object.values(getParameterValue(camundaParam)))
        .flatMap(arr => arr)
        .filter((foundValue: string) => foundValue.toLowerCase().includes(searchPhrase));
