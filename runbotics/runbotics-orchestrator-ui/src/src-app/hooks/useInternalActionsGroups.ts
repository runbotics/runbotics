import getApiActions from '#src-app/Actions/api.actions';
import getApplicationActions from '#src-app/Actions/application.actions';
import getAsanaActions from '#src-app/Actions/asana.actions';
import getBeeOfficeActions from '#src-app/Actions/beeOffice.actions';
import getBrowserActions from '#src-app/Actions/browser.actions';
import getCsvActions from '#src-app/Actions/csv.actions';
import getDesktopActions from '#src-app/Actions/desktop.actions';
import getExcelActions from '#src-app/Actions/excel.actions';
import getFileActions from '#src-app/Actions/file.actions';
import getGeneralActions from '#src-app/Actions/general.actions';
import getGoogleSheetsActions from '#src-app/Actions/googleSheets.actions';
import getJavascriptActions from '#src-app/Actions/javascript.actions';
import getJiraActions from '#src-app/Actions/jira.actions';
import getLoopActions from '#src-app/Actions/loop.actions';
import getMailActions from '#src-app/Actions/mail.actions';
import getPowerPointActions from '#src-app/Actions/powerpoint.actions';
import getSapActions from '#src-app/Actions/sap.actions';
import getSharepointExcelActions from '#src-app/Actions/sharepointExcel.actions';
import getSharepointFileActions from '#src-app/Actions/sharepointFile.actions';
import getVariablesActions from '#src-app/Actions/variables.actions';
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
        desktopAutomation: {
            label: 'Desktop',
            items: Object.values(getDesktopActions())
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
        jira: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.Jira'
            ),
            items: Object.values(getJiraActions())
        },
        file: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.File'
            ),
            items: Object.values(getFileActions())
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
        sharepointExcel: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.SharepointExcel'
            ),
            items: Object.values(getSharepointExcelActions())
        },
        sharepointFile: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.SharepointFile'
            ),
            items: Object.values(getSharepointFileActions())
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
        external: {
            label: translate(
                'Process.Details.Modeler.ActionsGroup.External'
            ),
            items: []
        }
    };
};

export default useInternalActionsGroups;
