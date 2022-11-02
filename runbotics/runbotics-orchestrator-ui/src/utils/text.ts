interface IText {
    text: string, 
    lowerCaseRest?: boolean, 
    delimiter?: string | RegExp, 
    join?: string
}

export const capitalizeFirstLetter = ({ text, lowerCaseRest = false, delimiter = " ", join }: IText) =>
    text
        .split(delimiter)
        .map((word) => word.charAt(0).toUpperCase() + (lowerCaseRest ? word.slice(1).toLowerCase() : word.slice(1)))
        .join(join ?? '');