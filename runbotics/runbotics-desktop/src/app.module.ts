import { Global, Module } from '@nestjs/common';
import { DesktopRunnerService } from './DesktopRunnerService';
import { ImportActionHandler } from './actions/import/ImportActionHandler';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailActionHandler } from './actions/mail/MailHandler';
import { LoopActionHandler } from './actions/loop/LoopActionHandler';
import { JIRAActionHandler } from './actions/jira/JIRAActionHandler';
import { HttpModule } from '@nestjs/common';
import { BeeOfficeActionHandler } from './actions/beeoffice/BeeOfficeActionHandler';
import { FileActionHandler } from './actions/files/FileActionHandler';
import { VariablesActionHandler } from './actions/variables/VariablesActionHandler';
import { CsvActionHandler } from './actions/csv/CsvActionHandler';
import { SharepointExcelActionHandler } from './actions/sharepoint/SharepointActionHandler';
import { BackgroundPageApiRequestHandler } from './config/BackgroundPageApiRequestHandler';
import { CoreModule } from './core/CoreModule';
import { MicrosoftModule } from './actions/microsoft/microsoft.module';
import { ConfigModule } from './config/RunBoticsConfigModule';
import GeneralAutomation from './actions/general/GeneralAutomation';
import { GoogleAuthenticationService } from './actions/google/GoogleAuthenticationService';
import { SharepointFileActionHandler } from './actions/sharepoint/SharepointFileActionHandler';

@Global()
@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: Number(process.env.MAIL_PORT),
                    secure: false, // upgrade later with STARTTLS
                    tls: { rejectUnauthorized: false },
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD,
                    },
                },
                defaults: {
                    from: 'runbotics',
                },
                template: {
                    dir: process.cwd() + '/templates/',
                    adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
                    options: {
                        strict: true,
                    },
                },
            }),
        }),
        ConfigModule,
        CoreModule,
        MicrosoftModule,
    ],
    providers: [
        DesktopRunnerService,
        GeneralAutomation,
        ImportActionHandler,
        MailActionHandler,
        LoopActionHandler,
        JIRAActionHandler,
        BeeOfficeActionHandler,
        BeeOfficeActionHandler,
        VariablesActionHandler,
        FileActionHandler,
        CsvActionHandler,
        SharepointExcelActionHandler,
        BackgroundPageApiRequestHandler,
        SharepointFileActionHandler,
        GoogleAuthenticationService,
    ],
    exports: [ConfigModule, DesktopRunnerService],
})
export class AppModule {
    constructor() { }
}
