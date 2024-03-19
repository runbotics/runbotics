import { isObjectOrArray, walkie } from 'obj-walker';

const MAX_ARRAY_LENGTH = 2;
const TRUNCATED_MESSAGE = '[Truncated]';

interface TruncateStructureParams {
    originalObject: object;
    maxSize: number;
}

type TruncateStructureOutput = string;

const truncateArrays = ({ val }) => {
    if (isObjectOrArray(val)) {
        for (const [key, value] of Object.entries(val)) {
            if(Array.isArray(value)) {
                const truncatedArr = val[key].slice(0, MAX_ARRAY_LENGTH);
                val[key] = [...truncatedArr, TRUNCATED_MESSAGE];
            }
        }
    }
};

export const truncateStructure = ({ originalObject, maxSize }: TruncateStructureParams): TruncateStructureOutput => {
    const truncatedArrays = walkie(originalObject, truncateArrays);
    const truncatedArraysJson = JSON.stringify(truncatedArrays, undefined, 2);
    if (truncatedArraysJson.length <= maxSize) {
        return JSON.parse(truncatedArraysJson);
    }
    const truncatedJson = truncatedArraysJson.slice(0, maxSize - TRUNCATED_MESSAGE.length) + TRUNCATED_MESSAGE;
    return truncatedJson;
};
