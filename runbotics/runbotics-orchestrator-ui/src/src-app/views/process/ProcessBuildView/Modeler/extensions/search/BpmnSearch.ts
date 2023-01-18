import { filter } from 'min-dash';

import { translate } from '#src-app/hooks/useTranslations';
import { TranslationsDescriptors } from '#src-app/translations/translations';
import { capitalizeFirstLetter } from '#src-app/utils/text';

import { BPMNElement } from '../../helpers/elementParameters';

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

    constructor(elementRegistry: any, searchPad: any, canvas: any) {
        this._elementRegistry = elementRegistry;
        this._canvas = canvas;

        searchPad.registerProvider(this);
    }

    public find(pattern: string): Result[] {
        const rootElement = this._canvas.getRootElement();
        return this._elementRegistry
            .filter(
                (element: BPMNElement) =>
                    element !== rootElement && element.id.startsWith('Activity')
            )
            .map((element: BPMNElement) => ({
                primaryTokens: matchAndSplit(getLabel(element), pattern),
                secondaryTokens: [],
                element: element
            }))
            .filter(
                (item: Result) =>
                    hasMatched(item.primaryTokens) ||
                    hasMatched(item.secondaryTokens)
            )
            .sort((item: Result) => getLabel(item.element) + item.element.id);
    }
}

const hasMatched = (tokens: Token[]): boolean => {
    const matched = filter(tokens, (token: Token) => Boolean(token.matched));

    return matched.length > 0;
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

const getLabel = (element: BPMNElement): string => {
    if (element.businessObject.label) return element.businessObject.label;
    const translateKey =
        `Process.Details.Modeler.Actions.${capitalizeFirstLetter({
            text: element.businessObject.actionId,
            lowerCaseRest: false,
            delimiter: '.',
            join: '.'
        })}.Label` as keyof TranslationsDescriptors;

    const translatedLabel = translate(translateKey);
    return translatedLabel;
};
