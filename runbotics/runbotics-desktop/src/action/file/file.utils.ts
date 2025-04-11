import fs from 'fs';
import path from 'path';
import { ActionRegex } from 'runbotics-common';

export async function createNewFile(path: string, truncate = false) {
    try {
        fs.closeSync(fs.openSync(`${path}`, truncate ? 'w' : 'a'));
    } catch (err) {
        throw Error(err);
    }
}

export function getUniqueFileName(filePath) {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext).replace(ActionRegex.FILE_SUFFIX, '');
    
    let counter = 1;
    let newFilePath = path.join(dir, `${baseName}(${counter})${ext}`);
    
    while (fs.existsSync(newFilePath)) {
        counter++;
        newFilePath = path.join(dir, `${baseName}(${counter})${ext}`);
    }

    return newFilePath;
}