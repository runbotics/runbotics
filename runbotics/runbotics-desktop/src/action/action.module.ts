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
import ImportActionHandler from './import';
import JiraActionHandler from './jira';
import LoopActionHandler from './loop';
import MailActionHandler from './mail';
import { MicrosoftModule } from './microsoft';
import JavaScriptActionHandler from './rce';
import SapActionHandler from './sap';
import SharepointExcelActionHandler from './sharepoint/excel';
import SharepointFileActionHandler from './sharepoint/file';
import VariableActionHandler from './variable';

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
    SapActionHandler,
    SharepointExcelActionHandler,
    SharepointFileActionHandler,
    VariableActionHandler,
];

@Module({
    imports: [
        MicrosoftModule,
        forwardRef(() => CoreModule),
    ],
    providers: ALL_ACTION_HANDLERS,
    exports: ALL_ACTION_HANDLERS,
})
export class ActionModule {}
