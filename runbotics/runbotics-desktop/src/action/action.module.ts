import { forwardRef, Module } from '@nestjs/common';

import { CoreModule } from '#core';
import { MailerModule } from '#mailer';

import ApiRequestHandler from './api-request';
import ApplicationActionHandler from './application';
import AsanaActionHandler from './asana';
import BeeOfficeActionHandler from './beeoffice';
import BrowserActionHandler from './browser';
import CsvActionHandler from './csv';
import FileActionHandler from './file';
import GeneralActionHandler from './general';
import GoogleActionHandler from './google';
import ImportActionHandler from './import';
import JiraActionHandler from './jira';
import LoopActionHandler from './loop';
import MailActionHandler from './mail';
import { MicrosoftModule } from './microsoft';
import JavaScriptActionHandler from './rce';
import SharepointFileActionHandler from './sharepoint/file';
import VariableActionHandler from './variable';
import { ExcelService } from './microsoft/excel';
import { MicrosoftGraphService } from './microsoft/microsoft-graph';
import { MicrosoftAuthService } from './microsoft/microsoft-auth.service';
import DesktopActionHandler from './desktop';

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
    JiraActionHandler,
    LoopActionHandler,
    MailActionHandler,
    JavaScriptActionHandler,
    SharepointFileActionHandler,
    VariableActionHandler,
    ExcelService,
    MicrosoftGraphService,
    MicrosoftAuthService,
    DesktopActionHandler
];

@Module({
    imports: [
        MailerModule,
        MicrosoftModule,
        forwardRef(() => CoreModule),
    ],
    providers: ALL_ACTION_HANDLERS,
    exports: ALL_ACTION_HANDLERS,
})
export class ActionModule {}
