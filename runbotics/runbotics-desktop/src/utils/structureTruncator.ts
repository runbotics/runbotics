// import truncateJson from 'truncate-json';
import { isObjectOrArray, walkie } from 'obj-walker';

const MAX_ARRAY_LENGTH = 2;

interface TruncateStructureParams {
    originalObject: object;
    maxSize: number;
}

type TruncateStructureOutput = string;

const truncateArrays = ({ val }) => {
    if(isObjectOrArray(val)){
        for (const [key, value] of Object.entries(val)) {
            if(Array.isArray(value)) {
                const truncatedArr = val[key].slice(0, MAX_ARRAY_LENGTH);
                val[key] = [...truncatedArr, '[Truncated]'];
            }
        }
    }
};

export const truncateStructure = ({ originalObject, maxSize }: TruncateStructureParams): TruncateStructureOutput => {
    const shortenedArrays = walkie(originalObject, truncateArrays);
    const json = JSON.stringify(shortenedArrays, undefined, 2);
    // const shortenedJson = truncateJson(json, maxSize).jsonString;
    return json;
};
// export const truncateStructure = (s) => {
//     return 'truncateStructure';
// };
// let truncateStructure;

// import('truncate-json').then(truncateJsonModule => {
//     const truncateJson = truncateJsonModule.default;
//     import('obj-walker').then(objWalkerModule => {
//         const { isObjectOrArray, walkie } = objWalkerModule;

//         const MAX_ARRAY_LENGTH = 2;

//         const truncateArrays = ({ val }) => {
//             if (isObjectOrArray(val)) {
//                 for (const [key, value] of Object.entries(val)) {
//                     if (Array.isArray(value)) {
//                         const truncatedArr = val[key].slice(0, MAX_ARRAY_LENGTH);
//                         val[key] = [...truncatedArr, '[Truncated]'];
//                     }
//                 }
//             }
//         };

//         truncateStructure = ({ originalObject, maxSize }) => {
//             const shortenedArrays = walkie(originalObject, truncateArrays);
//             const json = JSON.stringify(shortenedArrays, undefined, 2);
//             const shortenedJson = truncateJson(json, maxSize).jsonString;
//             return shortenedJson;
//         };
//     }).catch(error => {
//         console.error('Error loading obj-walker:', error);
//     });
// }).catch(error => {
//     console.error('Error loading truncate-json:', error);
// });

// export { truncateStructure };