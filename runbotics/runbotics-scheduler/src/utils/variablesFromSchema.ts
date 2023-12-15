import { BadRequestException } from '@nestjs/common';

const tryGetSchema = (executionInfo: string) => {
    try {
        const form = JSON.parse(executionInfo);
        const schema = form.schema;
        if (schema === undefined)
            throw new BadRequestException('Form object is not containing schema');

        return schema;
    } catch(err) {
        throw new BadRequestException(err);
    }
};

function getVariablesFromSchema(executionInfo: string, requiredOnly = false): string[] {
    const schema = tryGetSchema(executionInfo);

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
