module.exports = {
    env: {
        browser: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
        tsconfigRootDir: __dirname,
    },
    extends: ["airbnb", "airbnb-typescript", "airbnb/hooks", "plugin:@typescript-eslint/recommended", "plugin:@typescript-eslint/recommended-requiring-type-checking"],
        rules: {
            "max-len": [2, 120, 2, {
            "ignoreUrls": true,
            "ignoreComments": false
        }],
        // Taken from https://github.com/iamturns/create-exposed-app/blob/master/.eslintrc.js
        "no-prototype-builtins": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": [
            "error",
            {
                functions: false,
                classes: true,
                variables: true,
                typedefs: true,
            },
        ],
        "import/no-cycle": "off",
        "import/prefer-default-export": "off",
        "react/jsx-one-expression-per-line": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-floating-promises":"off",
        "no-param-reassign": ["error", { "props": true, "ignorePropertyModificationsForRegex": ["^state"], "ignorePropertyModificationsFor": ["accumulator"] }],
        "no-template-curly-in-string": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/naming-convention": ["warn"],
        "@typescript-eslint/no-unused-expressions": ["warn"],
        "react/forbid-prop-types": ["warn"],
        "no-case-declarations": "off",
        "@typescript-eslint/indent": [
            "error",
            4,
            {
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                // MemberExpression: null,
                FunctionDeclaration: {
                    parameters: 1,
                    body: 1,
                },
                FunctionExpression: {
                    parameters: 1,
                    body: 1,
                },
                CallExpression: {
                    arguments: 1,
                },
                ArrayExpression: 1,
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
                ignoredNodes: [
                    "JSXElement",
                    "JSXElement > *",
                    "JSXAttribute",
                    "JSXIdentifier",
                    "JSXNamespacedName",
                    "JSXMemberExpression",
                    "JSXSpreadAttribute",
                    "JSXExpressionContainer",
                    "JSXOpeningElement",
                    "JSXClosingElement",
                    "JSXFragment",
                    "JSXOpeningFragment",
                    "JSXClosingFragment",
                    "JSXText",
                    "JSXEmptyExpression",
                    "JSXSpreadChild",
                ],
                ignoreComments: false,
            },
        ],
        // Same as eslint-config-airbnb-base excluding for..of loop
        "no-restricted-syntax": [
            "error",
            {
                selector: "ForInStatement",
                message:
                    "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
            },
            {
                selector: "LabeledStatement",
                message:
                    "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
            },
            {
                selector: "WithStatement",
                message:
                    "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
            },
        ],
        "react/destructuring-assignment": "off",
        "react/jsx-filename-extension": "off",
        "react/prop-types": "off",
        "react/require-default-props": "off",
        "react/jsx-indent": "off",
        "react/jsx-indent-props": "off",
        "react/jsx-props-no-spreading": "off",
        "react-hooks/exhaustive-deps": "off",
    },
        settings: {
        react: {
            version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
        },
                "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },
    },
    overrides: [
        {
            files: ["*.styled.ts", "*.styles.ts"],
            rules: {
                "no-magic-numbers": "off",
                "import/prefer-default-export": "off",
            },
        },
                {
            files: ["*.js"],
            rules: {
                // Allow `require()`
                "@typescript-eslint/no-var-requires": "off",
            },
        },
    ],
        ignorePatterns: ["**/node_modules/**", "**/build/**", "**/dist/**"],
}
