const objFromArray = (arr: any[], key = 'id') => arr.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
}, {});

export const objFromPlainArray = (arr: any[]) => arr.reduce((accumulator, current) => {
    accumulator[current] = current;
    return accumulator;
}, {});

export default objFromArray;
