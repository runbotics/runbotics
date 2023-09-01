import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph';
import {
    OneDriveSession,
    Session,
    OpenFileInput,
    SharePointSession,
    WorkbookCellCoordinates,
    WorkbookRange,
    WorkbookRangeUpdateBody,
    WorkbookSessionInfo,
} from './excel.types';

import { MicrosoftCloudPlatform } from 'runbotics-common';
import { SharePointService } from '../file/service/share-point';

@Injectable()
export class ExcelService {
    private readonly logger = new RunboticsLogger(ExcelService.name);

    session: Session = null;

    constructor(private readonly microsoftGraphService: MicrosoftGraphService, private readonly sharePointService: SharePointService) {}

    // https://learn.microsoft.com/en-us/graph/api/workbook-createsession?view=graph-rest-1.0&tabs=http
    public async openFile(input: OpenFileInput): Promise<WorkbookSessionInfo> {
        const url = '/createSession';

        this.session =
            input.platform === MicrosoftCloudPlatform.SHARE_POINT
                ? await this.createSharePointSession(input)
                : this.createOneDriveSession(input);

        const workbookSessionInfo: WorkbookSessionInfo = await this.microsoftGraphService.post(
            this.createWorkbookUrl(url),
            {
                persistChanges: input.persistChanges,
            }
        );

        this.session = {
            ...this.session,
            workbookSessionInfo,
        };

        return workbookSessionInfo;
    }
    //https://learn.microsoft.com/en-us/graph/api/workbook-closesession?view=graph-rest-1.0&tabs=http
    public closeSession(): Promise<void> {
        const url = '/closeSession';

        return this.microsoftGraphService.post(
            this.createWorkbookUrl(url),
            {},
            {
                headers: {
                    'workbook-session-id': this.session.workbookSessionInfo.id,
                },
            }
        );
    }
    // https://learn.microsoft.com/en-us/graph/api/worksheet-cell?view=graph-rest-1.0&tabs=http
    public getCell(cellCoordinates: WorkbookCellCoordinates): Promise<WorkbookRange> {
        const url = `/worksheets/${this.session.worksheetIdentifier}/cell(row=${
            Number(cellCoordinates.row) - 1
        },column=${this.getColumnNumber(cellCoordinates.column) - 1})`;

        return this.microsoftGraphService.get(this.createWorkbookUrl(url), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }

    // https://learn.microsoft.com/en-us/graph/api/worksheet-range?view=graph-rest-1.0&tabs=http
    public getRange(address: string): Promise<WorkbookRange> {
        const url = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}')`;

        return this.microsoftGraphService.get(this.createWorkbookUrl(url), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }

    // https://learn.microsoft.com/en-us/graph/api/range-insert?view=graph-rest-1.0&tabs=http
    public setCell(address: string, value: string): Promise<WorkbookRange> {
        const url = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}:${address}')`;

        const newRange: WorkbookRangeUpdateBody = {
            values: [[value]],
        };

        return this.microsoftGraphService.patch(this.createWorkbookUrl(url), newRange, {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }

    // https://learn.microsoft.com/en-us/graph/api/range-insert?view=graph-rest-1.0&tabs=http
    public async setRange(address: string, values: string | any[][]) {
        const url = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}')`;

        if (!Array.isArray(values)) {
            values = JSON.parse(values) as (string | number | boolean)[][];
        }

        const newRange: WorkbookRangeUpdateBody = {
            values,
        };

        return this.microsoftGraphService.patch(this.createWorkbookUrl(url), newRange, {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }

    private createWorkbookUrl(url: string) {
        switch (this.session.platform) {
            case MicrosoftCloudPlatform.SHARE_POINT:
                return `/sites/${this.session.siteId}/drives/${this.session.driveId}/items/${this.session.fileId}/workbook`.concat(
                    url
                );
            case MicrosoftCloudPlatform.ONE_DRIVE:
                return `/me/drive/root:/${this.session.sessionIdentifier}:/workbook`.concat(url);
            default:
                throw new Error('Invalid platform');
        }
    }

    private getColumnNumber(column: string): number {
        //Calculates the column number based on the column letter
        // e.g.A = 1  AA = 27, AB = 28, etc.
        // it uses the ASCII code of the letter to calculate the number
        // e.g A = 65, B = 66, C = 67, etc.
        // so we subtract 64 from the ASCII code to get the column number
        return (column.length - 1) * 26 + (column.charCodeAt(column.length - 1) - 64);
    }

    private async createSharePointSession(input: SharePointSession): Promise<Session> {
        const siteId = await this.sharePointService.getSiteIdByName(input.siteName);
        const driveId = await this.sharePointService.getDriveIdBySiteAndListName(siteId, input.listName);
        const fileId = await this.sharePointService.getItemId(siteId, driveId, input.sessionIdentifier);

        return {
            platform: input.platform,
            sessionIdentifier: input.sessionIdentifier,
            workbookSessionInfo: null,
            worksheetIdentifier: input.worksheetIdentifier,
            siteId,
            driveId,
            fileId,
        };
    }

    private createOneDriveSession(
        input: OneDriveSession
    ): Session {
        return {
            platform: input.platform,
            sessionIdentifier: input.sessionIdentifier,
            workbookSessionInfo: null,
            worksheetIdentifier: input.worksheetIdentifier,
        };
    }
}
