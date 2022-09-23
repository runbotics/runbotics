export const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export const convertToPascalCase = (rawText: string) =>
    rawText
        .split(/_| /)
        .map((word) => capitalizeFirstLetter(word))
        .join('');
