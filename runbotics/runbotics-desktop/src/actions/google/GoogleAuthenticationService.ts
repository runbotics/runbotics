import { Injectable, OnModuleInit } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import Sheets = sheets_v4.Sheets;
import Schema$ValueRange = sheets_v4.Schema$ValueRange;
import { RunboticsLogger } from '../../logger/RunboticsLogger';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
    private readonly logger = new RunboticsLogger(GoogleAuthenticationService.name);

    constructor() {}

    async initLogin() {
        const oauth2Client = new google.auth.OAuth2(
            '373359756354-7bdu5c7ibjoiprlak9snb8rgpahnq06q.apps.googleusercontent.com',
            'KAR6T2_qDA7c-co_pdbwLjRb',
            'http://localhost:3333',
        );

        // generate a url that asks permissions for Blogger and Google Calendar scopes
        const scopes = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];

        const url = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',

            // If you only need one scope you can pass it as a string
            scope: scopes,
        });

        this.logger.log('url', url);
    }

    async test(): Promise<any> {
        const oauth2Client = new google.auth.OAuth2(
            '373359756354-7bdu5c7ibjoiprlak9snb8rgpahnq06q.apps.googleusercontent.com',
            'KAR6T2_qDA7c-co_pdbwLjRb',
            'http://localhost:3333',
        );
        this.logger.log('token', process.env.GOOGLE_AUTHORIZATION_CODE);
        const { tokens } = await oauth2Client.getToken(process.env.GOOGLE_AUTHORIZATION_CODE);
        this.logger.log('tokens', tokens);
        // oauth2Client.setCredentials(tokens)

        // const sheets = new Sheets({ auth: oauth2Client })
        // const spreadsheet = await sheets.spreadsheets.create({
        //     requestBody:
        //         {
        //             'dataSourceSchedules': [],
        //             'dataSources': [],
        //             'developerMetadata': [],
        //             'namedRanges': [],
        //             'properties': {},
        //             'sheets': [],
        //             'spreadsheetId': 'my_spreadsheetId',
        //             'spreadsheetUrl': 'my_spreadsheetUrl'
        //         }
        //
        // })
        // console.log('tokens', spreadsheet)
    }

    // async test2() {
    //     const tokens = {
    //         // access_token: 'ya29.a0AfH6SMAoAefrRP31fFaIc7KM2TZz4IwKMf9jQC-SB6wRDxk3y_WWBnJI8ZslqB1wsar-mcdkQGTSJMBkI1nDScviW22-ig4-jDg3qjslTP69UUC1t1taAHt4Uv8HD4huWo7vmjGKn8C2GZHyLQHCxNBVIcAd',
    //         refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    //         scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/spreadsheets',
    //         token_type: 'Bearer',
    //         // expiry_date: 1621692181315
    //     }
    //
    //     const oauth2Client = new google.auth.OAuth2(
    //         '373359756354-7bdu5c7ibjoiprlak9snb8rgpahnq06q.apps.googleusercontent.com',
    //         'KAR6T2_qDA7c-co_pdbwLjRb',
    //         'http://localhost:3333'
    //     )
    //     this.logger.log('tokens', tokens)
    //     oauth2Client.setCredentials(tokens)
    //     const sheets = new Sheets({ auth: oauth2Client })
    //
    //     // const spreadsheet = await sheets.spreadsheets.create({
    //     //     requestBody:
    //     //         {
    //     //             'dataSourceSchedules': [],
    //     //             'dataSources': [],
    //     //             'developerMetadata': [],
    //     //             'namedRanges': [],
    //     //             'properties': {},
    //     //             'sheets': [],
    //     //             'spreadsheetId': '',
    //     //             'spreadsheetUrl': ''
    //     //         }
    //     // })
    //     const spreadsheet = await sheets.spreadsheets.get({
    //         spreadsheetId: '13-INLpquqKIBtMrHFAZWCRpWkLcthyMqDkMlGpdv6U8'
    //     })
    //
    //     const values = [
    //         [
    //             "cell1", "cell2"
    //         ],
    //         [
    //             "cell2", "cell3"
    //         ],
    //         // Additional rows ...
    //     ];
    //     const body: Schema$ValueRange = {
    //         values: values
    //     };
    //     sheets.spreadsheets.values.update({
    //         spreadsheetId: spreadsheet.data.spreadsheetId!,
    //         range: "A1",
    //         valueInputOption: 'USER_ENTERED',
    //         requestBody: body
    //     })
    //     this.logger.log('spreadshet', spreadsheet)
    //     // const drive = google.drive({
    //     //     version: 'v3',
    //     //     auth: oauth2Client
    //     // });
    //     //
    //     // const result = await drive.files.list({q: 'raport_worklog'})
    //     // const files = result.data;
    //
    //
    //     // console.log("filessss", files)
    //
    // }
    async onModuleInit(): Promise<any> {
        // await this.initLogin();
        // await this.test();
        // await this.test2();
    }
}
