import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph';
import {
    Session,
    SessionIdentifier,
    WorkbookCellCoordinates,
    WorkbookRange,
    WorkbookRangeUpdateBody,
    WorkbookSessionInfo,
    WorksheetIdentifier,
} from './excel.types';

@Injectable()
export class ExcelService {
    private readonly logger = new RunboticsLogger(ExcelService.name);

    session: Session = null;


    constructor(private readonly microsoftGraphService: MicrosoftGraphService) {}


    // https://learn.microsoft.com/en-us/graph/api/workbook-createsession?view=graph-rest-1.0&tabs=http
    public async openFile(sessionIdentifier: SessionIdentifier, worksheetIdentifier: WorksheetIdentifier, token: string): Promise<WorkbookSessionInfo> {
        const request = '/createSession';

        const response: WorkbookSessionInfo =  await this.microsoftGraphService.post(this.createWorkbookUrl(sessionIdentifier, request), {
            persistChanges: true,
        }, {
            headers: this.getAuthHeader(token)
        });

        this.session = {
            sessionIdentifier: sessionIdentifier,
            worksheetIdentifier: worksheetIdentifier,
            workbookSessionInfo: response,
            token: token
        };

        return response;
    }
    //https://learn.microsoft.com/en-us/graph/api/workbook-closesession?view=graph-rest-1.0&tabs=http
    public async closeSession(): Promise<void> {
        const request = '/closeSession';

        return await this.microsoftGraphService.post(
            this.createWorkbookUrl(this.session.sessionIdentifier, request),
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
    public async getCell(
        worksheetIdentifier: WorksheetIdentifier,
        cellCoordinates: WorkbookCellCoordinates
    ): Promise<WorkbookRange> {
        const request = `/worksheets/${worksheetIdentifier}/cell(row=${cellCoordinates.row},column=${cellCoordinates.column})`;

        return await this.microsoftGraphService.get(this.createWorkbookUrl(this.session.sessionIdentifier, request), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }
    // https://learn.microsoft.com/en-us/graph/api/worksheet-range?view=graph-rest-1.0&tabs=http
    public async getRange(
        worksheetIdentifier: WorksheetIdentifier,
        address: string
    ): Promise<WorkbookRange> {
        const request = `/worksheets/${worksheetIdentifier}/range(address=${address})`;

        return await this.microsoftGraphService.get(this.createWorkbookUrl(this.session.sessionIdentifier, request), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }
    // https://learn.microsoft.com/en-us/graph/api/range-insert?view=graph-rest-1.0&tabs=http
    public async setCell(
        worksheetIdentifier: WorksheetIdentifier,
        address: string,
        body: WorkbookRangeUpdateBody
    ): Promise<WorkbookRange> {
        const request = `/worksheets/${worksheetIdentifier}/range(address=${address})`;

        return await this.microsoftGraphService.patch(
            this.createWorkbookUrl(this.session.sessionIdentifier, request),
            { body },
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

    private getAuthHeader(token?: string) {
        return {
            Authorization: `Bearer ${token??this.session.token}`
        };
    }

    private createWorkbookUrl(sessionIdentifier: SessionIdentifier, request: string) {
        if (typeof sessionIdentifier === 'number') {
            request = `/me/drive/items/${sessionIdentifier}/workbook`.concat(request);
        }

        if (typeof sessionIdentifier === 'string') {
            request = `/me/drive/root:/${sessionIdentifier}/workbook`.concat(request);
        }

        return request;
    }
}
