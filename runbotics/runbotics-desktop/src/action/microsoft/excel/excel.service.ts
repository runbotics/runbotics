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
import { OneDrive, Sharepoint } from 'runbotics-common';

@Injectable()
export class ExcelService {
    private readonly logger = new RunboticsLogger(ExcelService.name);

    session: Session = null;

    constructor(private readonly microsoftGraphService: MicrosoftGraphService) {}

    // https://learn.microsoft.com/en-us/graph/api/workbook-createsession?view=graph-rest-1.0&tabs=http
    public async openFile(
        platform: Platform,
        sessionIdentifier: SessionIdentifier,
        worksheetIdentifier: WorksheetIdentifier,
        persistChanges: boolean,
        siteRelativePath?: string
    ): Promise<WorkbookSessionInfo> {
        const request = '/createSession';

        this.session = {
            platform,
            sessionIdentifier,
            worksheetIdentifier,
            workbookSessionInfo: null,
        };

        const workbookSessionInfo: WorkbookSessionInfo = await this.microsoftGraphService.post(
            this.createWorkbookUrl(request),
            {
                persistChanges: persistChanges,
            }
        );

        this.session = {
            ...this.session,
            workbookSessionInfo,
        };

        return workbookSessionInfo;
    }
    //https://learn.microsoft.com/en-us/graph/api/workbook-closesession?view=graph-rest-1.0&tabs=http
    public async closeSession(): Promise<void> {
        const request = '/closeSession';

        return await this.microsoftGraphService.post(
            this.createWorkbookUrl(request),
            {},
            {
                headers: {
                    'workbook-session-id': this.session.workbookSessionInfo.id,
                },
            }
        );
    }
    // https://learn.microsoft.com/en-us/graph/api/worksheet-cell?view=graph-rest-1.0&tabs=http
    public async getCell(cellCoordinates: WorkbookCellCoordinates): Promise<WorkbookRange> {
        const request = `/worksheets/${this.session.worksheetIdentifier}/cell(row=${
            Number(cellCoordinates.row) - 1
        },column=${this.getColumnNumber(cellCoordinates.column) - 1})`;

        return await this.microsoftGraphService.get(this.createWorkbookUrl(request), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }
    // https://learn.microsoft.com/en-us/graph/api/worksheet-range?view=graph-rest-1.0&tabs=http
    public async getRange(address: string): Promise<WorkbookRange> {
        const request = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}')`;

        return await this.microsoftGraphService.get(this.createWorkbookUrl(request), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }
    // https://learn.microsoft.com/en-us/graph/api/range-insert?view=graph-rest-1.0&tabs=http
    public async setCell(address: string, value: string): Promise<WorkbookRange> {
        const request = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}:${address}')`;

        const newRange: WorkbookRangeUpdateBody = {
            values: [[value]],
        };

        return await this.microsoftGraphService.patch(this.createWorkbookUrl(request), newRange, {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }
    // https://learn.microsoft.com/en-us/graph/api/range-insert?view=graph-rest-1.0&tabs=http
    public async setRange(address: string, values: string | any[][]) {
        const request = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}')`;

        if (!Array.isArray(values)) {
            values = JSON.parse(values) as any[][];
        }

        const newRange: WorkbookRangeUpdateBody = {
            values,
        };

        return await this.microsoftGraphService.patch(this.createWorkbookUrl(request), newRange, {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }

    private createWorkbookUrl(request: string) {
        switch (this.session.platform) {
            case Sharepoint:
                request =
                    `/sites/${this.session.siteId}/drives/${this.session.driveId}/root:/${this.session.sessionIdentifier}:/workbook`.concat(
                        request
                    );
                break;
            case OneDrive:
                request = `/me/drive/root:/${this.session.sessionIdentifier}:/workbook`.concat(request);
                break;
            default:
                throw new Error('Invalid platform');
        }

        return request;
    }

    private getColumnNumber(column: string): number {
        return (column.length - 1) * 26 + (column.charCodeAt(column.length - 1) - 64);
    }

    private async getDriveIdBySite(siteId: string) {
        const url = `/sites/${siteId}/drives/?$select=id,name`;

        const data = (await this.microsoftGraphService.get(url)) as any;

        const driveId = data.value[0].id;

        return driveId;
    }
}
