import path from 'path';
import { CONTENT_TYPES } from './types';

export function bufferFromBase64(base64File: string) {
    if (base64File.includes('base64,')) {
        return Buffer.from(base64File.split(';base64,').pop(), 'base64');
    }
    return Buffer.from(base64File, 'base64');
}

export function getContentType(filePath: string) {
    const fileExtension = path.extname(filePath);
    if (!fileExtension) {
        throw new Error('File path needs to specify extension, e.g. file.pptx');
    }

    return CONTENT_TYPES.find((type) => type.key === fileExtension).value;
}