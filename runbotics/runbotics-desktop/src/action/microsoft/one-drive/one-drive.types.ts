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

export interface CreateShareLinkParams {
    shareType: string;
    shareScope: string;
    itemName: string;
    parentFolderPath?: string;
}