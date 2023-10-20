export interface UploadFileParams {
    filePath: string,
    content: Buffer,
    contentType: string,
}

export interface MoveFileParams {
    filePath: string;
    destinationFolderPath: string;
}

export interface DeleteItemParams {
    itemPath: string;
}
