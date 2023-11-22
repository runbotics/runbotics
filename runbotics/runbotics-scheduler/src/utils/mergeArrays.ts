export const mergeArrays = (valuesToMerge: unknown[]) => {
    const uniqueValues = new Set(valuesToMerge);
    const nowDuplicatesArray = Array.from(uniqueValues);

    return nowDuplicatesArray;
};
