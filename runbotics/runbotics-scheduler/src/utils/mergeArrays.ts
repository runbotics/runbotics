export const mergeArraysWithoutDuplicates = (valuesToMerge: unknown[]) => {
    const uniqueValues = new Set(valuesToMerge);
    const noDuplicatesArray = Array.from(uniqueValues);

    return noDuplicatesArray;
};
