import { Injectable } from '@nestjs/common';
import { DesktopRunRequest, DesktopRunResponse, StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { google, sheets_v4 } from 'googleapis';
import Schema$ValueRange = sheets_v4.Schema$ValueRange;
import Sheets = sheets_v4.Sheets;
import { ServerConfigService } from '#config';

export type GoogleActionRequest = 
| DesktopRunRequest<'google.sheets.write', GoogleSheetWriteActionInput>;

export type GoogleSheetWriteActionInput = {
    values: any[][];
    range?: string;
};
export type GoogleSheetWriteActionOutput = any;

@Injectable()
export default class GoogleActionHandler extends StatelessActionHandler {
    constructor(
        private readonly serverConfigService: ServerConfigService,
    ) {
        super();
    }

    async write(input: GoogleSheetWriteActionInput): Promise<GoogleSheetWriteActionOutput> {
        const tokens = {
            refresh_token: this.serverConfigService.googleRefreshToken,
            scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets',
            token_type: 'Bearer',
        };

        const oauth2Client = new google.auth.OAuth2(
            '373359756354-7bdu5c7ibjoiprlak9snb8rgpahnq06q.apps.googleusercontent.com',
            'KAR6T2_qDA7c-co_pdbwLjRb',
            'http://localhost:3333',
        );
        await oauth2Client.setCredentials(tokens);
        const sheets = new Sheets({ auth: oauth2Client });

        const spreadsheet = await sheets.spreadsheets.get({
            spreadsheetId: '13-INLpquqKIBtMrHFAZWCRpWkLcthyMqDkMlGpdv6U8',
        });

        const body: Schema$ValueRange = {
            values: input.values,
        };
        await sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheet.data.spreadsheetId!,
            range: input.range ? input.range : 'A1',
            valueInputOption: 'USER_ENTERED',
            requestBody: body,
        });
    }

    run(request: GoogleActionRequest) {
        switch (request.script) {
            case 'google.sheets.write':
                return this.write(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
