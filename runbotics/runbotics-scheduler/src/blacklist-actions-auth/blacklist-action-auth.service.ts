import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
    ACTION_GROUP,
    AllActionIds,
    ApiAction,
    ApplicationAction,
    AsanaAction,
    BeeOfficeAction,
    BrowserAction,
    CloudExcelAction,
    CloudFileAction,
    CsvAction,
    DesktopAction,
    DesktopOfficeAction,
    ExcelAction,
    FileAction,
    FolderAction,
    GeneralAction,
    GoogleAction,
    ImageAction,
    JavascriptAction,
    JiraCloudAction,
    JiraServerAction,
    LoopAction,
    MailAction,
    SapAction,
    SqlAction,
    VariableAction,
    VisualBasicAction,
    WindowsAction,
    ZipAction,
} from 'runbotics-common';
import BPMNModdle, { Definitions } from 'bpmn-moddle';
import { Logger } from '#/utils/logger';
import { ProcessEntity } from '#/scheduler-database/process/process.entity';
import { ActionBlacklist } from '#/scheduler-database/action-blacklist/action-blacklist.entity';

@Injectable()
export class BlacklistActionAuthService {
    private readonly logger = new Logger(BlacklistActionAuthService.name);
    private moddle = new BPMNModdle();

    constructor(private readonly dataSource: DataSource) {
    }

    private allActions = {
        VariableAction,
        GeneralAction,
        MailAction,
        BrowserAction,
        LoopAction,
        ApiAction,
        JavascriptAction,
        AsanaAction,
        GoogleAction,
        JiraCloudAction,
        JiraServerAction,
        FileAction,
        CsvAction,
        DesktopOfficeAction,
        CloudExcelAction,
        CloudFileAction,
        BeeOfficeAction,
        SapAction,
        ApplicationAction,
        ExcelAction,
        DesktopAction,
        VisualBasicAction,
        ImageAction,
        FolderAction,
        ZipAction,
        SqlAction,
    };

    private actionByGroup: Record<ACTION_GROUP, string[]> = {
        [ACTION_GROUP.API]: Object.values(ApiAction),
        [ACTION_GROUP.BROWSER]: Object.values(BrowserAction),
        [ACTION_GROUP.GENERAL]: Object.values(GeneralAction),
        [ACTION_GROUP.JAVASCRIPT]: Object.values(JavascriptAction ?? {}),
        [ACTION_GROUP.SAP]: Object.values(SapAction),
        [ACTION_GROUP.VARIABLES]: Object.values(VariableAction),
        [ACTION_GROUP.BEEOFFICE]: Object.values(BeeOfficeAction),
        [ACTION_GROUP.JIRA]: [],
        [ACTION_GROUP.JIRA_CLOUD]: Object.values(JiraCloudAction),
        [ACTION_GROUP.JIRA_SERVER]: Object.values(JiraServerAction),
        [ACTION_GROUP.ASANA]: Object.values(AsanaAction),
        [ACTION_GROUP.MAIL]: Object.values(MailAction),
        [ACTION_GROUP.LOOP]: Object.values(LoopAction),
        [ACTION_GROUP.GOOGLE]: Object.values(GoogleAction),
        [ACTION_GROUP.DESKTOP_OFFICE_ACTIONS]: Object.values(DesktopOfficeAction),
        [ACTION_GROUP.CLOUD_EXCEL]: Object.values(CloudExcelAction),
        [ACTION_GROUP.CLOUD_FILE]: Object.values(CloudFileAction),
        [ACTION_GROUP.APPLICATION]: Object.values(ApplicationAction),
        [ACTION_GROUP.CSV]: Object.values(CsvAction),
        [ACTION_GROUP.FILE]: Object.values(FileAction),
        [ACTION_GROUP.FOLDER]: Object.values(FolderAction),
        [ACTION_GROUP.DESKTOP]: Object.values(DesktopAction),
        [ACTION_GROUP.EXCEL]: Object.values(ExcelAction),
        [ACTION_GROUP.POWER_POINT]: Object.values(DesktopOfficeAction),
        [ACTION_GROUP.WINDOWS]: Object.values(WindowsAction),
        [ACTION_GROUP.VISUAL_BASIC]: Object.values(VisualBasicAction),
        [ACTION_GROUP.ZIP]: Object.values(ZipAction),
        [ACTION_GROUP.EXTERNAL]: [],
    };

    private extractValidActionsFromProcessDefinition(obj: any): string[] {
        const result = new Set<string>();
        const allActionValues: string[] = Object.values(this.allActions)
            .flatMap(Object.values);

        function searchForBodies(target: any) {
            if (Array.isArray(target)) {
                target.forEach(searchForBodies);
            } else if (typeof target === 'object' && target !== null) {
                for (const [key, value] of Object.entries(target)) {
                    if (key === '$body' && typeof value === 'string') {
                        if (allActionValues.includes(value)) {
                            result.add(value);
                        }
                    } else {
                        searchForBodies(value);
                    }
                }
            }
        }

        function recurse(current: any) {
            if (Array.isArray(current)) {
                current.forEach(recurse);
            } else if (typeof current === 'object' && current !== null) {
                if (
                    typeof current.id === 'string' &&
                    /^Activity_.*$/.test(current.id)
                ) {
                    searchForBodies(current);
                }

                Object.values(current).forEach(recurse);
            }
        }

        recurse(obj);
        return Array.from(result);
    }

    private async validateProcessActionsByBlacklist(definition: Definitions): Promise<boolean> {
        const blacklistRepo = this.dataSource.getRepository(ActionBlacklist);

        const blacklist = (await blacklistRepo.find({ take: 1 })).at(0);

        if (!blacklist) {
            this.logger.log('No blacklist found, skipping check');
            return true;
        }
        const validBodies = this.extractValidActionsFromProcessDefinition(definition);
        let blacklistedActions = blacklist.actionIds ?? [];

        for (const group of (blacklist.actionGroups ?? [])) {
            const groupActions = this.actionByGroup[group];
            blacklistedActions.push(...groupActions as AllActionIds[]);
        }

        blacklistedActions = Array.from(new Set(blacklistedActions));

        const isBlacklisted = validBodies.some(body => blacklistedActions.includes(body as AllActionIds));
        return isBlacklisted;
    }

    async checkProcessActionsBlacklistByDefinition(definition: string): Promise<boolean> {
        try {
            const converted = await this.moddle.fromXML(definition);
            return this.validateProcessActionsByBlacklist(converted);
        } catch (error) {
            this.logger.error('Error processing process definition:', error);
            throw error;
        }

    }

    async checkProcessActionsBlacklist(processId: number): Promise<boolean> {
        try {
            const processRepo = this.dataSource.getRepository(ProcessEntity);

            const process = await processRepo.findOneBy({ id: processId });
            
            if (!process) {
                return false;
            }
            const converted = await this.moddle.fromXML(process.definition);
            return this.validateProcessActionsByBlacklist(converted);
        } catch (error) {
            this.logger.error(`Error processing process definition for ID ${processId}:`, error);
            throw error;
        }
    }
}
