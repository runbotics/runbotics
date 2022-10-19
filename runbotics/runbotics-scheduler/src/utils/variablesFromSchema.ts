import { JSONSchema7 } from 'json-schema';

function getVariablesFromSchema(schema: JSONSchema7, requiredOnly = false): string[] {
    if (requiredOnly) {
        return schema?.required ?? [];
    } else {
        const variables: string[] = [];
        for (const key in schema.properties) {
            variables.push(key);
        }
        return variables;
    }
}
export function isObject(obj: unknown) {
    return !!obj && typeof obj === 'object' && !Array.isArray(obj);
}

export default getVariablesFromSchema;
