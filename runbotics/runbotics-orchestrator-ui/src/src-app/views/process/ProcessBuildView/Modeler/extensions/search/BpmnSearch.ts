import _ from 'lodash';

import { findVariablesInAction, findVariablesInGateway, findVariablesInLoop } from '#src-app/utils/findVariablesInActivities';
import { getActivityType, Activity } from '#src-app/utils/getActivityType';
import getElementLabel from '#src-app/utils/getElementLabel';

import { BPMNElement, BPMNElementRegistry, BpmnSubProcess } from '../../helpers/elementParameters';

interface Token {
    normal?: string;
    matched?: string;
}

interface Result {
    primaryTokens: Token[];
    secondaryTokens: Token[];
    element: BPMNElement;
    activityLabelId: string;
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
        const _elements: BPMNElementRegistry = this._elementRegistry._elements;

        const foundVariablesInActions: Result[] = Object.values(_elements)
            ?.reduce<Result[]>((currentElements, objectElement) => {
                if (objectElement.element !== rootElement && hasVariables(objectElement.element, pattern)) {
                    const activityLabel = objectElement.element.id.startsWith('Gateway')
                        ? objectElement.element.id
                        : getElementLabel(objectElement.element);

                    currentElements.push({
                        primaryTokens: [{ normal: `variable in: ${activityLabel}` }],
                        secondaryTokens: [],
                        element: objectElement.element,
                        activityLabelId: activityLabel + objectElement.element.id
                    });
                }
                return currentElements;
            }, [])
            .sort((resultA, resultB) => resultA.activityLabelId.localeCompare(resultB.activityLabelId));

        const foundActions: Result[] = Object.values(_elements)?.reduce<Result[]>((currentElements, objectElement) => {
            if (
                objectElement.element === rootElement ||
                (objectElement.element === rootElement && !objectElement.element.id.startsWith('Activity'))
            ) {
                return currentElements;
            }
            const activityLabel = objectElement.element.id.startsWith('Gateway')
                ? objectElement.element.id
                : getElementLabel(objectElement.element);

            const action = {
                primaryTokens: matchAndSplit(activityLabel, pattern),
                secondaryTokens: [],
                element: objectElement.element,
                activityLabelId: activityLabel + objectElement.element.id
            };

            if (hasMatched(action.primaryTokens) || hasMatched(action.secondaryTokens)) {
                currentElements.push(action);
            }

            return currentElements;
        }, []);

        return [...sortByLabelId(foundVariablesInActions), ...sortByLabelId(foundActions)];
    }
}

const hasMatched = (tokens: Token[]): boolean => {
    const matched = tokens.filter((token: Token) => Boolean(token.matched));

    return matched.length > 0;
};

const hasVariables = (element: BPMNElement, pattern: string) => {
    const lowerCasePattern = pattern.toLowerCase();
    const activityType = getActivityType(element);
    
    if (!activityType) return false;
    
    switch (activityType) {
        case Activity.GATEWAY:
            return findVariablesInGateway(element, lowerCasePattern);
        case Activity.LOOP:
            return findVariablesInLoop(element as BpmnSubProcess, lowerCasePattern);
        case Activity.ACTION:
            return findVariablesInAction(element, lowerCasePattern);
        default:
            return false;
    }
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

const sortByLabelId = (results: Result[]): Result[] =>
    _.sortBy(results, function (obj) {
        return obj.activityLabelId;
    });

BpmnSearchProvider.$inject = ['elementRegistry', 'searchPad', 'canvas'];
