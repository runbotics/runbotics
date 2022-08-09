import * as Jexl from "jexl";
import getPropertyValue from "./getPropertyValue";

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

const isExpressionPattern = /^\${(.+?)}$/;
const expressionPattern = /\${(.+?)}/;
const jexlPattern = /#{(.+?)}/;

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

            const expressionMatch = templatedString.match(jexlPattern);
            const innerProperty = expressionMatch[1];
            response.jexl = true;
            response.result = Jexl.evalSync(innerProperty, jexlContext);
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
}
