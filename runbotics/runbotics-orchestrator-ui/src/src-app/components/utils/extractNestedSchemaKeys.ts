import { JSONSchema7 } from 'json-schema';

function extractNestedSchemaKeys(schema: JSONSchema7, keySeparator = '.'): string[] {
    // eslint-disable-next-line complexity
    const flattenRecursive = (schemaPropeties: JSONSchema7, parentProperty?: string, propertyMap: Record<string, unknown> = {}) => {
        for (const [key, value] of Object.entries(schemaPropeties)) {
            const property = parentProperty ? `${parentProperty}${keySeparator}${key}` : key;

            if (value && typeof value === 'object' && value?.properties) { flattenRecursive(value.properties, property, propertyMap); }
            else { propertyMap[property] = value; }

        }
        return propertyMap;
    };

    return Object.keys(flattenRecursive(schema?.properties));
}
export default extractNestedSchemaKeys;
