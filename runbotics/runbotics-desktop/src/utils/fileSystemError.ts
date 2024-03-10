import { FileSystemErrorMessages } from 'runbotics-common';

export const handleFileSystemError = (action: string, e: any) => {
    console.log(e);
    if (!e.code) {
        throw new Error(`${action} action failed with error: ${e}`);
    }

    if (e.code in FileSystemErrorMessages) { 
        throw new Error(`${action} action: ${FileSystemErrorMessages[e.code]}`);
    }
    
    throw new Error(`${action} action: Unexpected error has occured.`);
};
