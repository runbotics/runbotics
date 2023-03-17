export const replaceRegExpUnallowedChars = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createPattern = (textToHighlight) => new RegExp(`${textToHighlight}`, 'gi');
