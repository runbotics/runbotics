
import getElementLabel from '#src-app/utils/getElementLabel';

import { BPMNElement, CamundaParameter, IBpmnSubProcessBusinessObject, ISequenceFlowBusinessObject, getParameterValue } from '../../helpers/elementParameters';

interface Token {
    normal?: string;
    matched?: string;
}

interface Result {
    primaryTokens: Token[];
    secondaryTokens: Token[];
    element: BPMNElement;
}

interface SearchProvider {
    find(pattern: string): Result[];
}

export default class BpmnSearchProvider implements SearchProvider {
    private _elementRegistry: any;
    private _canvas: any;
    static $inject: string[];

    constructor(elementRegistry: any, searchPad: any, canvas: any) {
        this._elementRegistry = elementRegistry;
        this._canvas = canvas;

        searchPad.registerProvider(this);
    }

    public find(pattern: string): Result[] {
        const rootElement = this._canvas.getRootElement();

        const foundVariablesInActivities = this._elementRegistry
            .filter((element: BPMNElement) => element !== rootElement && hasVariables(element, pattern))
            .map((element: BPMNElement) => ({
                primaryTokens: [{ normal: `variable in: ${element.id.startsWith('Gateway') ? element.id : getElementLabel(element)}` }],
                secondaryTokens: [],
                element: element
            }))
            .sort((item: Result) => item + item.element.id);

        const actions = this._elementRegistry
            .filter(
                (element: BPMNElement) =>
                    (element !== rootElement && hasVariables(element, pattern)) || (rootElement && element.id.startsWith('Activity'))
            )
            .map((element: BPMNElement) => ({
                primaryTokens: matchAndSplit(getElementLabel(element), pattern),
                secondaryTokens: [],
                element: element
            }))
            .filter((item: Result) => hasMatched(item.primaryTokens) || hasMatched(item.secondaryTokens))
            .sort((item: Result) => getElementLabel(item.element) + item.element.id);

        return [...foundVariablesInActivities, ...actions];
    }
}

const hasMatched = (tokens: Token[]): boolean => {
    const matched = tokens.filter((token: Token) => Boolean(token.matched));

    return matched.length > 0;
};

const hasVariables = (element: BPMNElement, pattern: string) => {
    const lowerCasePattern = pattern.toLowerCase();
    const businessObject = element.businessObject;
    let variableFound = false;

    if (element.id.startsWith('Gateway')) {
        const gatewayOutgoingFlows: ISequenceFlowBusinessObject[] = (businessObject as unknown as BPMNElement)
            .outgoing as unknown as ISequenceFlowBusinessObject[];

        const gatewayExpressions = gatewayOutgoingFlows
            .map(flow => flow.conditionExpression.body.toLowerCase())
            .filter(expression => expression.includes(lowerCasePattern));

        variableFound = gatewayExpressions.length > 0;
    }

    if (variableFound) {
        return variableFound;
    }
    
    if (businessObject.actionId === 'loop.loop') {
        const loopVariable = (element.businessObject as IBpmnSubProcessBusinessObject).loopCharacteristics.loopCardinality.body;
        variableFound = loopVariable.toLowerCase().includes(lowerCasePattern);
    }

    if (variableFound) {
        return variableFound;
    }

    const extensionElements = businessObject.extensionElements;

    if (!extensionElements) {
        return variableFound;
    }

    const inputValues = extensionElements.values[0].inputParameters;
    const outputValues = extensionElements.values[0].outputParameters;

    if (inputValues && inputValues.length > 0) {
        const inputVariable = inputValues.filter(
            value =>
                (value.name === 'variable' && value.value.toLowerCase().includes(lowerCasePattern)) ||
                (value.name === 'value' && (value.value.startsWith('#{') || value.value.startsWith('${')) && value.value.toLowerCase().includes(lowerCasePattern))
        );

        const hashVariables = inputValues
            .filter(value => value.name === 'variables' || value.name === 'functionParams')
            .map((camundaParam: CamundaParameter) => Object.values(getParameterValue(camundaParam)))
            .flatMap(arr => arr)
            .filter((foundValue: string) => foundValue.toLowerCase().includes(lowerCasePattern));

        variableFound = [...inputVariable, ...hashVariables].length > 0;
    }

    if (variableFound) {
        return variableFound;
    }

    if (outputValues && outputValues.length > 0) {
        const outputVariable = outputValues.filter(
            value => value.name === 'variableName' && value.value.toLowerCase().includes(lowerCasePattern)
        );
        variableFound = outputVariable.length > 0;
    }

    if (variableFound) {
        return variableFound;
    }

    return false;
};

const matchAndSplit = (text: string, pattern: string): Token[] => {
    const tokens = [];
    if (!text) return tokens;

    const lowerCaseText = text.toLowerCase();
    const lowerCasePattern = pattern.toLowerCase();

    const matchIndex = lowerCaseText.indexOf(lowerCasePattern);
    if (matchIndex === -1) {
        tokens.push({ normal: text });
        return tokens;
    }

    const matchedText = text.substring(matchIndex, matchIndex + pattern.length);
    const beforeMatch = text.substring(0, matchIndex);
    const afterMatch = text.substring(matchIndex + pattern.length);

    if (beforeMatch) tokens.push({ normal: beforeMatch });
    tokens.push({ matched: matchedText });
    if (afterMatch) tokens.push({ normal: afterMatch });

    return tokens;
};

BpmnSearchProvider.$inject = ['elementRegistry', 'searchPad', 'canvas'];
