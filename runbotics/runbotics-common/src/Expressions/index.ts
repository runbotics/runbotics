import * as Jexl from "jexl";
import getPropertyValue from "./getPropertyValue";

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

const isExpressionPattern = /^\${(.+?)}$/;
const expressionPattern = /\${(.+?)}/;
const jexlPattern = /#{(.+?)}/;
const jexlServicePattern = /#{(.+?)\((.*)\)}/;
const jexlServiceMethodPattern = /(.+?)\((.*)\)/;
const jexlMatchingBracketsPattern = /#\{((?:[^{}]|#\{(?:[^{}]|#\{[^{}]*\})*\})*)\}/;
const digitPattern = /^-?\d+(\.?\d+)?$/;

export class Expressions {
    public static isInitialized = false;
    public static initialize = () => {
        if (!Expressions.isInitialized) {
            Expressions.isInitialized = true;
            try {
                // @ts-ignore
                Jexl.addFunction("length", (array: any[]) =>
                    array ? array.length : 0
                );
            } catch (e) {
                console.error("e", e);
            }
        }
    };
    public static resolveExpression(
        templatedString,
        context,
        expressionFnContext
    ) {
        Expressions.initialize();
        if (Expressions.isOutputVariableToSave(templatedString, context)) {
            context.environment.variables[`${context.environment.output?.variableName}`] = context.content.output[0];
        } else if (context.environment?.variables?.content?.type === 'bpmn:SubProcess') {
            const elementVariableName = context.environment.variables?.content?.input?.elementVariable;
            context.environment.variables[elementVariableName] = context.environment.variables?.content?.[elementVariableName];
        }

        if (jexlServicePattern.test(templatedString)) {
            templatedString = Expressions.getFullServiceMethodCall(templatedString, context, expressionFnContext);
        }

        let jexlResult = Expressions.tryResolveJexlExpression(
            templatedString,
            context,
            expressionFnContext
        );

        let result;
        if (!jexlResult.jexl) {
            result = Expressions.internalResolveExpression(
                templatedString,
                context,
                expressionFnContext
            );
        } else {
            result = jexlResult.result;
        }
        return result;
    }

    private static isOutputVariableToSave(templatedString, context) {
        return templatedString &&
            templatedString.includes('content.output') &&
            context?.content?.output?.length > 0 &&
            context?.content?.output[0] !== undefined &&
            context?.environment?.output?.variableName;
    }

    private static getFullServiceMethodCall(templatedString: string, context, expressionFnContext) {
        const jexlMatchingBracketsRegExp = new RegExp(jexlMatchingBracketsPattern, 'g');
        const matches = templatedString.match(jexlMatchingBracketsRegExp);
        if (!matches) {
            return templatedString;
        }

        let result = templatedString;
        for (const expressionMatch of matches) {
            const recursivelyExtractedExpression =
                jexlMatchingBracketsRegExp.exec(templatedString);
            if (!recursivelyExtractedExpression) continue;

            const extractedMethod =
                jexlServiceMethodPattern.exec(recursivelyExtractedExpression[1]);
            if (!extractedMethod) continue;

            const [_, methodName, methodArgs] = extractedMethod;
            const args = methodArgs.length
                ? methodArgs.trim().split(",")
                : [];

            const mappedArgs = args.map((arg) => {
                const trimmedArg = arg.trim();
                if (jexlServicePattern.test(trimmedArg)) {
                    return Expressions.resolveExpression(trimmedArg, context, expressionFnContext);
                } else if (trimmedArg === 'iterator') {
                    return context.environment.variables.content.index;
                } else if (Expressions.isVariableArgument(trimmedArg)) {
                    return 'environment.variables.' + trimmedArg;
                }
                return trimmedArg;
            });

            const serviceMethodCall =
                '${environment.services.' + methodName + '(' + mappedArgs.join(',') + ')}';

            const resolvedServiceExpression =
                Expressions
                    .internalResolveExpression(
                        serviceMethodCall,
                        context,
                        expressionFnContext,
                    );

            if (expressionMatch === templatedString) {
                result = resolvedServiceExpression;
                continue;
            }

            result = result.replace(
                expressionMatch,
                resolvedServiceExpression,
            );
        }

        return result;
    }

    private static isVariableArgument(arg) {
        return arg !== 'true' && arg !== 'false'
            && !digitPattern.test(arg)
            && !arg.includes('"') && !arg.includes('\'')
            && !arg.includes("environment.variables");
    }

    private static tryResolveJexlExpression(
        templatedString,
        context,
        expressionFnContext
    ) {
        let response = {
            jexl: false,
            result: undefined,
        };
        if (jexlPattern.test(templatedString)) {
            // jexl works only for variables
            const jexlContext = {
                ...context.environment.variables.content,
                ...context.environment.output,
                ...context.environment.variables,
            };

            response.jexl = true;

            const jexlRegExp = new RegExp(jexlPattern, 'g');
            const property = templatedString.replace(
                jexlRegExp, (expressionMatch, innerProperty) => {
                    if (innerProperty === "iterator") {
                        return jexlContext.index;
                    }

                    const evaluatedProperty = Jexl.evalSync(innerProperty, jexlContext);
                    const isPropertyCollection = this.checkIsCollection(evaluatedProperty);

                    return isPropertyCollection ? JSON.stringify(evaluatedProperty) : evaluatedProperty;
                }
            );

            try {
                const parsedProperty = JSON.parse(property);
                response.result = parsedProperty;
            } catch (error) {
                response.result = property === 'undefined' ? undefined : property;
            }

            if (property === "true") {
                response.result = true;
            } else if (property === "false") {
                response.result = false;
            } else if (property === "null") {
                response.result = null;
            }
        }

        return response;
    }

    private static internalResolveExpression(
        templatedString,
        context,
        expressionFnContext
    ) {
        let result = templatedString;

        while (expressionPattern.test(result)) {
            const expressionMatch = result.match(expressionPattern);
            const innerProperty = expressionMatch[1];

            if (innerProperty === "true") {
                return true;
            } else if (innerProperty === "false") {
                return false;
            } else if (innerProperty === "null") {
                return null;
            } else {
                const n = Number(innerProperty);
                if (!isNaN(n)) return n;
            }

            // @ts-ignore
            const contextValue = (0, getPropertyValue)(
                context,
                innerProperty,
                expressionFnContext
            );
            if (expressionMatch.input === expressionMatch[0]) {
                return contextValue;
            }

            result = result.replace(
                expressionMatch[0],
                contextValue === undefined ? "" : contextValue
            );
        }

        return result;
    }

    public static isExpression(text) {
        if (!text) return false;
        return isExpressionPattern.test(text);
    }

    public static hasExpression(text) {
        if (!text) return false;
        return expressionPattern.test(text);
    }

    private static checkIsCollection(value) {
        return Array.isArray(value) || typeof value === "object";
    }
}
