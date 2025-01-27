export interface IAction {
    id?: string;
    label?: string | null;
    script?: string | null;
    credentialType?: string | null;
    form?: string | null;
}

const defaultForm = {
    schema: {
        type: 'object',
        properties: {
            input: {
                title: 'Input',
                type: 'object',
                properties: {
                    hello: {
                        type: 'string',
                        title: 'Hello',
                    },
                },
                required: ['hello'],
            },
            output: {
                title: 'Output',
                type: 'object',
                properties: {
                    variableName: {
                        title: 'Variable name',
                        description: 'Assign the output to variable',
                        type: 'string',
                    },
                },
                required: ['variableName'],
            },
        },
    },
    uiSchema: {
        'ui:order': ['input', 'output'],
    },
    formData: {
        input: {},
        output: {
            variableName: '',
        },
    },
};

export const defaultValue: Readonly<IAction> = {
    id: '',
    label: '',
    credentialType: '',
    script: 'external.',
    form: JSON.stringify(defaultForm, null, '\t'),
};
