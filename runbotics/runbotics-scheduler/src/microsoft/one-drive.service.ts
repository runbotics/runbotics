import { Injectable } from '@nestjs/common';
import { Logger } from 'src/utils/logger';
import { MicrosoftGraphService } from './microsoft-graph.service';

@Injectable()
export class OneDriveService {
    private readonly logger = new Logger(OneDriveService.name);

    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
    ) {}

    getItem(itemId: string) {
        return this.microsoftGraphService.api(`/me/drive/items/${itemId}`)
            .get();
    }

    deleteItemByPath(itemPath: string) {
        // chyba mozna prosciej https://learn.microsoft.com/en-us/graph/api/driveitem-delete?view=graph-rest-1.0&tabs=http
        // chyba nie https://learn.microsoft.com/en-us/graph/api/resources/onedrive?view=graph-rest-1.0
        return this.microsoftGraphService.api(`me/drive/root:/${itemPath}`)
            .delete();
    }

    private bufferFromBase64(base64File: string) {
        if (base64File.includes('base64,')) {
            return Buffer.from(base64File.split(';base64,').pop(), 'base64');
        }
        return Buffer.from(base64File, 'base64');
    }

    uploadFile(fullFilePath: string, content: string, contentType: string) {
        return this.microsoftGraphService.api(`/me/drive/root:/${fullFilePath}:/content`)
            .header('Content-Type', contentType)
            .put(this.bufferFromBase64(content));
    }

    // large file upload: https://github.com/microsoftgraph/msgraph-sdk-javascript/blob/HEAD/docs/tasks/LargeFileUploadTask.md
}
