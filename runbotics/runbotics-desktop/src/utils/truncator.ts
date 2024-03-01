
export const truncateObject = (obj: any, maxLength: number, path: string[] = [], totalArraysCount = 0): any => {
    const truncatedObj: any = {};
    const arrays: { key: string, value: any[] }[] = [];

    // Objects copying & arrays collecting
    for (const key of Object.keys(obj)) {
        const newPath = [...path, key];
        const newLength = JSON.stringify(truncatedObj).length + newPath.join('.').length + 2; // +2 for the colon

        if (newLength <= maxLength) {
            if (Array.isArray(obj[key])) {
                arrays.push({ key, value: obj[key] });
                totalArraysCount++;
            } else if (typeof obj[key] === 'object') {
                truncatedObj[key] = truncateObject(obj[key], maxLength, newPath, totalArraysCount);
            } else {
                truncatedObj[key] = obj[key];
            }
        } else {
            return truncatedObj;
        }
    }

    // Allocation of space for each collected array
    let remainingSpace = maxLength - JSON.stringify(truncatedObj).length;
    let allArraysLength = 0;
    for (const array of arrays) {
        allArraysLength += JSON.stringify(array.value).length;
    }
    for (const { key, value } of arrays) {
        const allocatedSpace = Math.floor(JSON.stringify(value).length / allArraysLength * (remainingSpace / totalArraysCount));
        // Trimming of the array
        const lastCurlyBraceIndex = findLastIndexOfCurlyBrace(JSON.stringify(obj[key]), allocatedSpace);
        let slicedArray = '[]';
        if (lastCurlyBraceIndex !== -1) {
            slicedArray = JSON.stringify(obj[key]).slice(0, lastCurlyBraceIndex);
            const diff = countOpeningBraces(slicedArray) - countClosingBraces(slicedArray);
            // Adding append braces
            slicedArray = addClosingCurlyBraces(slicedArray, diff);
            slicedArray += ']'; // Append closing square bracket
        }
        console.log(slicedArray);
        truncatedObj[key] = JSON.parse(slicedArray);
        remainingSpace -= slicedArray.length;
    }
    return truncatedObj;
};

const findLastIndexOfCurlyBrace = (arrayString: string, allocatedSpace: number): number => {
    let lastIndex = -1;
    let currentIndex = arrayString.indexOf('}');
    while (currentIndex !== -1 && currentIndex < allocatedSpace) {
        lastIndex = currentIndex;
        currentIndex = arrayString.indexOf('}', currentIndex + 1);
    }
    return lastIndex === -1 ? findCloseOfFirstElement(arrayString) : lastIndex; // although there's to less space - add part to first brace
};

const findCloseOfFirstElement = (arrayString: string): number => 
    arrayString.indexOf('},{') === -1 ? arrayString.indexOf('}') : arrayString.indexOf('},{');

const countOpeningBraces = (str: string): number => {
    return (str.match(/{/g) || []).length;
};

const countClosingBraces = (str: string): number => {
    return (str.match(/}/g) || []).length;
};

const addClosingCurlyBraces = (jsonString: string, diff: number): string => {
    if (diff <= 0) {
        return jsonString;
    }
    for (let i = 0; i < diff; i++) {
        jsonString += '}';
    }
    return jsonString;
};
