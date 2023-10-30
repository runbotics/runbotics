import { WriteStream, existsSync, lstatSync } from 'fs';
import path from 'path';

export const verifyDestinationPath = (fileName: string, dirPath: string | undefined) => {
    if (dirPath && (!existsSync(dirPath) || !lstatSync(dirPath).isDirectory())) {
        throw new Error(`Provided path "${dirPath}" does not exist or it is not a directory`);
    }

    const resultPath = `${dirPath ?? '.'}/${fileName}`;
    const absolutePath = path.resolve(resultPath);
    return absolutePath;
};

export const saveFileStream = (writer: WriteStream, path: string) => {
    return new Promise<string>((resolve, reject) => {
        let error = null;
        writer.on('error', (err) => {
            error = err;
            writer.close();
            reject(err);
        });
        writer.on('close', () => {
            if (!error) {
                resolve(path);
            }
        });
    });
};
