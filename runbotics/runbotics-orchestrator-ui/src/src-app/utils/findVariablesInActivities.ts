import {
    BPMNElement,
    BpmnSubProcess,
    CamundaInputParameter,
    CamundaOutputParameter,
    CamundaParameter,
    getParameterValue
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

export const findVariablesInGateway = (element: BPMNElement, searchPhrase: string): boolean => {
    const gatewayExpressions = element.outgoing
        .map(flow => flow.businessObject.conditionExpression.body.toLowerCase())
        .filter(expression => expression.includes(searchPhrase));

    return gatewayExpressions.length > 0;
};

export const findVariablesInLoop = (element: BpmnSubProcess, searchPhrase: string): boolean => {
    const loopVariable = element.businessObject.loopCharacteristics.loopCardinality.body;
    return loopVariable.toLowerCase().includes(searchPhrase);
};

export const findVariablesInAction = (element: BPMNElement, searchPhrase: string): boolean => {
    const extensionElements = element.businessObject.extensionElements;

    if (!extensionElements) return false;

    const inputValues = extensionElements.values[0].inputParameters;
    const outputValues = extensionElements.values[0].outputParameters;

    return findInputVariablesInAction(inputValues, searchPhrase) || findOutputVariablesInAction(outputValues, searchPhrase);
};

const findInputVariablesInAction = (inputValues: CamundaInputParameter[], searchPhrase: string) => {
    if (!inputValues) return false;
    const inputVariable = inputValues.filter(
        value => 
            (value.name === 'variable' && value.value.toLowerCase().includes(searchPhrase)) ||
            (value.value && hasValueSearchPhrase(value.value, searchPhrase))
    );

    const hashVariables = findHashDollarVariable(inputValues, searchPhrase);

    return [...inputVariable, ...hashVariables].length > 0;
};

const findOutputVariablesInAction = (outputValues: CamundaOutputParameter[], searchPhrase: string) => {
    if (!outputValues) return false;
    const outputVariable = outputValues.filter(
        value => value.name === 'variableName' && value.value && value.value.toLowerCase().includes(searchPhrase)
    );

    const hashVariables = findHashDollarVariable(outputValues, searchPhrase);

    return [...outputVariable, ...hashVariables].length > 0;
};

const findHashDollarVariable = (extensionElementValues: CamundaParameter[], searchPhrase: string) =>
    extensionElementValues.reduce((variables, currValue) => {
        if (currValue.name !== 'variables' && currValue.name !== 'functionParams') return variables;

        const variablesObject = Object.values(getParameterValue(currValue)).find((lookupValue: string) =>
            lookupValue.toLowerCase().includes(searchPhrase)
        );

        if (!variablesObject) return variables;

        variables.push(variablesObject);

        return variables;
    }, []);

const hasValueSearchPhrase = (value: string, searchPhrase: string) => {
    const lookIn = value.toLowerCase();

    if (lookIn.toLowerCase().includes(searchPhrase)) return true;

    if ((lookIn.includes('#{') || lookIn.includes('${')) && lookIn.toLowerCase().includes(searchPhrase)) return true;

    return false;
};
