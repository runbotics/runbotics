import { Injectable } from '@nestjs/common';
import { RunboticsLogger } from '#logger';

import { MicrosoftGraphService } from '../microsoft-graph';
import {
    Drive,
    DriveItem,
    Platform,
    Session,
    SessionIdentifier,
    Site,
    WorkbookCellCoordinates,
    WorkbookRange,
    WorkbookRangeUpdateBody,
    WorkbookSessionInfo,
    WorksheetIdentifier,
} from './excel.types';

import { ONE_DRIVE, SHARE_POINT } from 'runbotics-common';

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
        siteRelativePath?: string,
        list?: string
    ): Promise<WorkbookSessionInfo> {
        const request = '/createSession';

        let siteId = null;

        let driveId = null;

        let fileId = null;


        if (platform === SHARE_POINT) {
            siteId = (await this.getSiteIdByName(siteRelativePath)).id;
            driveId = await this.getDriveIdBySiteAndListName(siteId, list);
            fileId = await this.getItemId(siteId,driveId, sessionIdentifier);
        }

        this.session = {
            platform,
            sessionIdentifier,
            worksheetIdentifier,
            workbookSessionInfo: null,
            siteId,
            driveId,
            fileId
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

        return this.microsoftGraphService.post(
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

        return this.microsoftGraphService.get(this.createWorkbookUrl(request), {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }

    // https://learn.microsoft.com/en-us/graph/api/worksheet-range?view=graph-rest-1.0&tabs=http
    public async getRange(address: string): Promise<WorkbookRange> {
        const request = `/worksheets/${this.session.worksheetIdentifier}/range(address='${address}')`;

        return this.microsoftGraphService.get(this.createWorkbookUrl(request), {
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

        return this.microsoftGraphService.patch(this.createWorkbookUrl(request), newRange, {
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

        return this.microsoftGraphService.patch(this.createWorkbookUrl(request), newRange, {
            headers: {
                'workbook-session-id': this.session.workbookSessionInfo.id,
            },
        });
    }

    private createWorkbookUrl(request: string) {
        switch (this.session.platform) {
            case SHARE_POINT:
                return `/sites/${this.session.siteId}/drives/${this.session.driveId}/items/${this.session.fileId}/workbook`.concat(
                    request
                );
            case ONE_DRIVE:
                return `/me/drive/root:/${this.session.sessionIdentifier}:/workbook`.concat(request);
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

    private async getSiteIdByName(name: string): Promise<Site> {
        const url = `/sites?search=${name}`;
        return (await this.microsoftGraphService.get(url))['value'][0];
    }

    private async getDriveIdBySiteAndListName(siteId: string, listName: string) {
        const url = `/sites/${siteId}/drives/`;

        const data = (await this.microsoftGraphService.get(url))['value'] as Drive[];

        return data.filter(drive => drive.name === listName)[0].id;
    }

    private async getItemId(siteId:string, driveId: string ,path: string) {
        const url = `/sites/${siteId}/drives/${driveId}/root:/${path}`;

        const data: DriveItem = (await this.microsoftGraphService.get(url));

        return data.id;
    }
}
