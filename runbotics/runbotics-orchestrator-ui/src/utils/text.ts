interface CapitalizeFirstLetterParams {
    text: string, 
    lowerCaseRest?: boolean, 
    delimiter?: string | RegExp, 
    join?: string
}

export const capitalizeFirstLetter = ({ text, lowerCaseRest = false, delimiter, join }: CapitalizeFirstLetterParams) => {
    if(!text) return text;
    return text
        .split(delimiter)
        .map((word) => word.charAt(0).toUpperCase() + (lowerCaseRest ? word.slice(1).toLowerCase() : word.slice(1)))
        .join(join ?? '');
};
