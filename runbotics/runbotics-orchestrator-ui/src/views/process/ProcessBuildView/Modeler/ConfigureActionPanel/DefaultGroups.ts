import {isNamespaceLoaded, translate } from 'src/hooks/useTranslations';
import applicationActions from './Actions/ApplicationActions';
import sapActions from './Actions/SAPActions';
import generalActions from './Actions/GeneralActions';
import variablesActions from './Actions/VariablesActions';
import sharepointExcelActions from './Actions/SharepointExcelActions';
import desktopOfficeActions from './Actions/DesktopOfficeActions';
import sharepointFileActions from './Actions/SharepointFileActions';
import mailActions from './Actions/MailActions';
import browserActions from './Actions/BrowserActions';
import beeOfficeActions from './Actions/BeeOfficeActions';
import csvActions from './Actions/CsvActions';
import fileActions from './Actions/FileActions';
import javascriptActions from './Actions/JavascriptActions';
import apiActions from './Actions/ApiActions';
import jiraActions from './Actions/JiraActions';
import googleSheetsActions from './Actions/GoogleSheetsActions';
import asanaActions from './Actions/AsanaActions';
import internalBpmnActions from './Actions';
import { internalTemplates } from './Templates';
import moment from 'moment';

export const defaultActionGroups = {
    variables: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Variables'),
        items: Object.values(variablesActions),
    },
    general: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.General'),
        items: Object.values(generalActions),
    },
    mail: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Mail'),
        items: Object.values(mailActions),
    },
    browser: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Browser'),
        items: Object.values(browserActions),
    },
    loop: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Loop'),
        items: [internalBpmnActions['loop.loop']],
    },
    api: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.API'),
        items: Object.values(apiActions),
    },
    javascript: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.JavaScript'),
        items: Object.values(javascriptActions),
    },
    asana: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Asana'),
        items: Object.values(asanaActions),
    },
    google: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Google'),
        items: Object.values(googleSheetsActions),
    },
    jira: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.JIRA'),
        items: Object.values(jiraActions),
    },
    file: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.File'),
        items: Object.values(fileActions),
    },
    csv: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.CSV'),
        items: Object.values(csvActions),
    },
    desktopOfficeActions: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.DesktopOffice'),
        items: Object.values(desktopOfficeActions),
    },
    sharepointExcel: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.SharePointExcel'),
        items: Object.values(sharepointExcelActions),
    },
    sharepointFile: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.SharePointFile'),
        items: Object.values(sharepointFileActions),
    },
    beeoffice: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.BeeOffice'),
        items: Object.values(beeOfficeActions),
    },
    sap: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.SAP'),
        items: Object.values(sapActions),
    },
    application: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Application'),
        items: Object.values(applicationActions),
    },
    external: {
        label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.External'),
        items: [],
    },
};

export const getActionGroups = async () => {
    try {
        await isNamespaceLoaded()
        
        return ({
            variables: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Variables'),
                items: Object.values(variablesActions),
            },
            general: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.General'),
                items: Object.values(generalActions),
            },
            mail: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Mail'),
                items: Object.values(mailActions),
            },
            browser: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Browser'),
                items: Object.values(browserActions),
            },
            loop: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Loop'),
                items: [internalBpmnActions['loop.loop']],
            },
            api: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.API'),
                items: Object.values(apiActions),
            },
            javascript: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.JavaScript'),
                items: Object.values(javascriptActions),
            },
            asana: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Asana'),
                items: Object.values(asanaActions),
            },
            google: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Google'),
                items: Object.values(googleSheetsActions),
            },
            jira: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.JIRA'),
                items: Object.values(jiraActions),
            },
            file: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.File'),
                items: Object.values(fileActions),
            },
            csv: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.CSV'),
                items: Object.values(csvActions),
            },
            desktopOfficeActions: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.DesktopOffice'),
                items: Object.values(desktopOfficeActions),
            },
            sharepointExcel: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.SharePointExcel'),
                items: Object.values(sharepointExcelActions),
            },
            sharepointFile: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.SharePointFile'),
                items: Object.values(sharepointFileActions),
            },
            beeoffice: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.BeeOffice'),
                items: Object.values(beeOfficeActions),
            },
            sap: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.SAP'),
                items: Object.values(sapActions),
            },
            application: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.Application'),
                items: Object.values(applicationActions),
            },
            external: {
                label: translate('Process.Details.Modeler.ActionPanel.ActionsGroup.External'),
                items: [],
            }
        })
    } catch(err) {
        throw new Error(err)
    }
}

export const defaultTemplatesGroups = {
    Login: {
        label: translate('Process.Details.Modeler.ActionPanel.TemplatesGroup.Login'),
        items: [internalTemplates['browser.login']],
    },
    Api: {
        label: translate('Process.Details.Modeler.ActionPanel.TemplatesGroup.API'),
        items: [internalTemplates['api.test']],
    },
};
