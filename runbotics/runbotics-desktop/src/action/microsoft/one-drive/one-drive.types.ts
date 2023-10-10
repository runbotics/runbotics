export interface UploadFileParams {
    fileName: string,
    content: Buffer,
    contentType: string,
    parentFolderPath?: string,
}

export interface MoveFileParams {
    fileName: string;
    destinationFolderPath: string;
    parentFolderPath?: string;
}

export interface DeleteItemParams {
    itemName: string;
    parentFolderPath?: string;
}
