import * as Jexl from "jexl";
import getPropertyValue from "./getPropertyValue";

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

const isExpressionPattern = /^\${(.+?)}$/;
const expressionPattern = /\${(.+?)}/;
const jexlPattern = /#{(.+?)}/g;

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

            const property = templatedString.replace(
                jexlPattern, (expressionMatch, innerProperty) => {
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
            } else if (innerProperty === "iterator") {
                return context.environment.variables.content.index;
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
