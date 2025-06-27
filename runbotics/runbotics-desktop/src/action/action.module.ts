import { forwardRef, Module } from '@nestjs/common';

import { CoreModule } from '#core';

import ApiRequestHandler from './api-request';
import ApplicationActionHandler from './application';
import AsanaActionHandler from './asana';
import BeeOfficeActionHandler from './beeoffice';
import BrowserActionHandler from './browser';
import CsvActionHandler from './csv';
import FileActionHandler from './file';
import GeneralActionHandler from './general';
import GoogleActionHandler from './google';
import ZipActionHandler from './zip';
import ImportActionHandler from './import';
import JiraCloudActionHandler from './jira/jira-cloud';
import JiraServerActionHandler from './jira/jira-server';
import LoopActionHandler from './loop';
import MailActionHandler from './mail';
import { MicrosoftModule } from './microsoft';
import JavaScriptActionHandler from './rce';
import VariableActionHandler from './variable';
import { ExcelService } from './microsoft/excel';
import DesktopActionHandler from './desktop';
import VisualBasicActionHandler from './visual-basic';
import { CloudExcelActionHandler } from './microsoft/automation/excel';
import { OneDriveService } from './microsoft/one-drive';
import { SharePointService } from './microsoft/share-point';
import { CloudFileActionHandler } from './microsoft/automation/file';
import { ImageActionHandler } from './image';
import FolderActionHandler from './folder/folder.action-handler';
import { MailService } from '#mailer/mailer.service';
import { SqlActionHandler } from './sql/sql.action-handler';
import { AuthModule } from '#core/auth/auth.module';

const ALL_ACTION_HANDLERS = [
    ApiRequestHandler,
    ApplicationActionHandler,
    AsanaActionHandler,
    BeeOfficeActionHandler,
    BrowserActionHandler,
    CsvActionHandler,
    FileActionHandler,
    GeneralActionHandler,
    GoogleActionHandler,
    ImportActionHandler,
    JiraCloudActionHandler,
    JiraServerActionHandler,
    LoopActionHandler,
    MailActionHandler,
    JavaScriptActionHandler,
    CloudExcelActionHandler,
    CloudFileActionHandler,
    VariableActionHandler,
    ExcelService,
    OneDriveService,
    SharePointService,
    DesktopActionHandler,
    VisualBasicActionHandler,
    ImageActionHandler,
    FolderActionHandler,
    ZipActionHandler,
    MailService,
    SqlActionHandler
];

@Module({
    imports: [
        AuthModule,
        MicrosoftModule,
        forwardRef(() => CoreModule),
    ],
    providers: ALL_ACTION_HANDLERS,
    exports: ALL_ACTION_HANDLERS,
})
export class ActionModule { }
