
import useTranslations from '#src-app/hooks/useTranslations';

import internalBpmnActions from './Actions';
import getApiActions from './Actions/api.actions';
import getApplicationActions from './Actions/application.actions';
import getAsanaActions from './Actions/asana.actions';
import getBeeOfficeActions from './Actions/beeOffice.actions';
import getBrowserActions from './Actions/browser.actions';
import getCsvActions from './Actions/csv.actions';
import getDesktopOfficeActions from './Actions/desktopOffice.actions';
import getFileActions from './Actions/file.actions';
import getGeneralActions from './Actions/general.actions';
import getGoogleSheetsActions from './Actions/googleSheets.actions';
import getJavascriptActions from './Actions/javascript.actions';
import getJiraActions from './Actions/jira.actions';
import getMailActions from './Actions/mail.actions';
import getSapActions from './Actions/sap.actions';
import getSharepointExcelActions from './Actions/sharepointExcel.actions';
import getSharepointFileActions from './Actions/sharepointFile.actions';
import getVariablesActions from './Actions/variables.actions';
import { ActionsGroupsProperties } from './useActionsGroups.types';


const useInternalActionsGroups = (): Record<string, ActionsGroupsProperties> => {
    const { translate } = useTranslations();

    return {
        variables: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Variables'),
            items: Object.values(getVariablesActions()),
        },
        general: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.General'),
            items: Object.values(getGeneralActions()),
        },
        mail: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Mail'),
            items: Object.values(getMailActions()),
        },
        browser: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Browser'),
            items: Object.values(getBrowserActions()),
        },
        loop: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Loop'),
            items: [internalBpmnActions['loop.loop']],
        },
        api: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.API'),
            items: Object.values(getApiActions()),
        },
        javascript: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.JavaScript'),
            items: Object.values(getJavascriptActions()),
        },
        asana: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Asana'),
            items: Object.values(getAsanaActions()),
        },
        google: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Google'),
            items: Object.values(getGoogleSheetsActions()),
        },
        jira: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.JIRA'),
            items: Object.values(getJiraActions()),
        },
        file: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.File'),
            items: Object.values(getFileActions()),
        },
        csv: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.CSV'),
            items: Object.values(getCsvActions()),
        },
        desktopOfficeActions: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.DesktopOffice'),
            items: Object.values(getDesktopOfficeActions()),
        },
        sharepointExcel: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.SharePointExcel'),
            items: Object.values(getSharepointExcelActions()),
        },
        sharepointFile: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.SharePointFile'),
            items: Object.values(getSharepointFileActions()),
        },
        beeoffice: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.BeeOffice'),
            items: Object.values(getBeeOfficeActions()),
        },
        sap: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.SAP'),
            items: Object.values(getSapActions()),
        },
        application: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Application'),
            items: Object.values(getApplicationActions()),
        },
        external: {
            label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.External'),
            items: [],
        },
    };
};

export default useInternalActionsGroups;
