import getAIActions from '#src-app/Actions/ai.actions';
import getApiActions from '#src-app/Actions/api.actions';
import getApplicationActions from '#src-app/Actions/application.actions';
import getAsanaActions from '#src-app/Actions/asana.actions';
import getBeeOfficeActions from '#src-app/Actions/beeOffice.actions';
import getBrowserActions from '#src-app/Actions/browser.actions';
import getCloudExcelActions from '#src-app/Actions/cloudExcel.actions';
import getCloudFileActions from '#src-app/Actions/cloudFile/cloudFile.actions';
import getCsvActions from '#src-app/Actions/csv.actions';
import getDesktopActions from '#src-app/Actions/desktop.actions';
import getExcelActions from '#src-app/Actions/excel.actions';
import getFileActions from '#src-app/Actions/file.actions';
import getFolderActions from '#src-app/Actions/folder.actions';
import getGeneralActions from '#src-app/Actions/general.actions';
import getGoogleSheetsActions from '#src-app/Actions/googleSheets.actions';
import getImageActions from '#src-app/Actions/image.actions';
import getJavascriptActions from '#src-app/Actions/javascript.actions';
import getJiraCloudActions from '#src-app/Actions/jira-cloud.actions';
import getJiraServerActions from '#src-app/Actions/jira-server.actions';
import getLoopActions from '#src-app/Actions/loop.actions';
import getMailActions from '#src-app/Actions/mail.actions';
import getPowerPointActions from '#src-app/Actions/powerpoint.actions';
import getSapActions from '#src-app/Actions/SapActions/sap.actions';
import getVariablesActions from '#src-app/Actions/variables.actions';
import getVisualBasicActions from '#src-app/Actions/visualBasic.actions';
import getWindowsActions from '#src-app/Actions/windows.actions';
import getZipActions from '#src-app/Actions/zip.actions';

import useTranslations from '#src-app/hooks/useTranslations';

import { ActionsGroupsProperties } from './useActionsGroups.types';

const useInternalActionsGroups = (): Record<
    string,
    ActionsGroupsProperties
> => {
    const { translate } = useTranslations();

    return {
        variables: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Variables'
            ),
            items: Object.values(getVariablesActions())
        },
        general: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.General'
            ),
            items: Object.values(getGeneralActions())
        },
        mail: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Mail'
            ),
            items: Object.values(getMailActions())
        },
        browser: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Browser'
            ),
            items: Object.values(getBrowserActions())
        },
        loop: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Loop.Loop'
            ),
            items: Object.values(getLoopActions())
        },
        api: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Api'
            ),
            items: Object.values(getApiActions())
        },
        javascript: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.JavaScript'
            ),
            items: Object.values(getJavascriptActions())
        },
        desktop: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Desktop'
            ),
            items: Object.values(getDesktopActions())
        },
        windows: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Windows'
            ),
            items: Object.values(getWindowsActions())
        },
        asana: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Asana'
            ),
            items: Object.values(getAsanaActions())
        },
        google: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Google'
            ),
            items: Object.values(getGoogleSheetsActions())
        },
        jiraCloud: {
            label: translate('Process.Details.Modeler.ActionsGroup.JiraCloud'),
            items: Object.values(getJiraCloudActions())
        },
        jiraServer: {
            label: translate('Process.Details.Modeler.ActionsGroup.JiraServer'),
            items: Object.values(getJiraServerActions())
        },
        file: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.File'
            ),
            items: Object.values(getFileActions())
        },
        folder: {
            label: translate('Process.Details.Modeler.ActionsGroup.Folder'),
            items: Object.values(getFolderActions())
        },
        zip: {
            label: translate('Process.Details.Modeler.ActionsGroup.Zip'),
            items: Object.values(getZipActions())
        },
        image: {
            label: translate('Process.Details.Modeler.ActionsGroup.Image'),
            items: Object.values(getImageActions()),
        },
        csv: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Csv'
            ),
            items: Object.values(getCsvActions())
        },
        excel: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Excel'
            ),
            items: Object.values(getExcelActions())
        },
        powerPoint: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Powerpoint'
            ),
            items: Object.values(getPowerPointActions())
        },
        cloudExcel: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.CloudExcel'
            ),
            items: Object.values(getCloudExcelActions())
        },
        cloudFile: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.CloudFile'
            ),
            items: Object.values(getCloudFileActions())
        },
        beeoffice: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.BeeOffice'
            ),
            items: Object.values(getBeeOfficeActions())
        },
        sap: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Sap'
            ),
            items: Object.values(getSapActions())
        },
        application: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Application'
            ),
            items: Object.values(getApplicationActions())
        },
        visualBasic: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.VisualBasic'
            ),
            items: Object.values(getVisualBasicActions())
        },
        external: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.External'
            ),
            items: []
        },
        ai: {
            label: 'AI',
            items: Object.values(getAIActions())
        }
    };
};

export default useInternalActionsGroups;
