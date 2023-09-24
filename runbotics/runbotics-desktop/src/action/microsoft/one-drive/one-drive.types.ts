export interface UploadFileParams {
    fileName: string,
    content: Buffer,
    contentType: string,
    parentFolderPath?: string,
}
