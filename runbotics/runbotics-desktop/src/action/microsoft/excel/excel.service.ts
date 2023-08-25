import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph';
import {
    Platform,
    Session,
    SessionIdentifier,
    WorkbookCellCoordinates,
    WorkbookRange,
    WorkbookRangeUpdateBody,
    WorkbookSessionInfo,
    WorksheetIdentifier,
} from './excel.types';
import { MicrosoftAuthService } from '../microsoft-auth.service';
import { OneDrive, Sharepoint } from 'runbotics-common';

@Injectable()
export class ExcelService {
    private readonly logger = new RunboticsLogger(ExcelService.name);

    session: Session= null;

    constructor(
        private readonly microsoftGraphService: MicrosoftGraphService,
        private readonly auth: MicrosoftAuthService
    ) {}

    // https://learn.microsoft.com/en-us/graph/api/workbook-createsession?view=graph-rest-1.0&tabs=http
    public async openFile(
        platform: Platform,
        sessionIdentifier: SessionIdentifier,
        worksheetIdentifier: WorksheetIdentifier,
        persistChanges: boolean,
        siteRelativePath?: string,
    ): Promise<WorkbookSessionInfo> {
        const request = '/createSession';

        this.session = {
            platform,
            sessionIdentifier,
            worksheetIdentifier,
            workbookSessionInfo: null,
            siteRelativePath,
        };
        // const test = await this.microsoftGraphService.get('/me/drives?$select=id,name,driveType,sharepointIds');
        // const test: Array<Drive> = await this.microsoftGraphService.get('/sites/root/drives');
        // const test3: Site = await this.microsoftGraphService.get('/sites/all41sonline.sharepoint.com/');
        // const test2 = await this.microsoftGraphService.get('/sites/all41sonline.sharepoint.com/drive/items/b!rCjXZLRbl0C-7vdPqoT3Fy0lXP4FOuBFpfZQhDsZq842Aqh9TzKXRaNadA8YozHr/children');
        const workbookSessionInfo: WorkbookSessionInfo = await this.microsoftGraphService.post(
            this.createWorkbookUrl(request),
            {
                persistChanges,
            }
        );

        this.session = {
            ...this.session,
            workbookSessionInfo
        };


        return workbookSessionInfo;
    }
    //https://learn.microsoft.com/en-us/graph/api/workbook-closesession?view=graph-rest-1.0&tabs=http
    public async closeSession(): Promise<void> {
        const request = '/closeSession';

        return await this.microsoftGraphService.post(
            this.createWorkbookUrl(request),
            {
                persistChanges: true,
            },
            {
                headers: {
                    'workbook-session-id': this.session.workbookSessionInfo.id,
                },
            }
        );
    }
    // https://learn.microsoft.com/en-us/graph/api/worksheet-cell?view=graph-rest-1.0&tabs=http
    public async getCell(cellCoordinates: WorkbookCellCoordinates): Promise<WorkbookRange> {
        const request = `/worksheets/${this.session.worksheetIdentifier}/cell(row=${cellCoordinates.row},column=${cellCoordinates.column})`;

        return await this.microsoftGraphService.get(this.createWorkbookUrl(request), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }
    // https://learn.microsoft.com/en-us/graph/api/worksheet-range?view=graph-rest-1.0&tabs=http
    public async getRange(address: string): Promise<WorkbookRange> {
        const request = `/worksheets/${this.session.worksheetIdentifier}/range(address=${address})`;

        return await this.microsoftGraphService.get(this.createWorkbookUrl(request), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }
    // https://learn.microsoft.com/en-us/graph/api/range-insert?view=graph-rest-1.0&tabs=http
    public async setCell(address: string, newRange: WorkbookRangeUpdateBody): Promise<WorkbookRange> {
        const request = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}:${address}')`;

        return await this.microsoftGraphService.patch(
            this.createWorkbookUrl(request),
            { newRange },
            {
                headers: {
                    'workbook-session-id': this.session.workbookSessionInfo.id,
                },
            }
        );
    }

    public async setRange() {
        //TODO
    }

    private createWorkbookUrl(request: string) {

        switch(this.session.platform) {
            case Sharepoint:
                // request = `/sites/${this.session.siteId}/drives/${this.driveId}/items/${this.fileId}/workbook/createSession`;
                break;
            case OneDrive:
                request = `/me/drive/root:/${this.session.sessionIdentifier}:/workbook`.concat(request);
                break;
            default:
                throw new Error('Invalid platform');
        }

        // if (typeof this.session.sessionIdentifier === 'number') {
        //     request = `/me/drive/items/${this.session.sessionIdentifier}/workbook`.concat(request);
        // }


        return request;
    }
}
