import getApiActions from './api.actions';
import getApplicationActions from './application.actions';
import getAsanaActions from './asana.actions';
import getBeeOfficeActions from './beeOffice.actions';
import getBrowserActions from './browser.actions';
import getCloudExcelActions from './cloudExcel.actions';
import getCloudFileActions from './cloudFile/cloudFile.actions';
import getCsvActions from './csv.actions';
import getDesktopActions from './desktop.actions';
import getExcelActions from './excel.actions';
import getFileActions from './file.actions';
import getFolderActions from './folder.actions';
import getGeneralActions from './general.actions';
import getGoogleSheetsActions from './googleSheets.actions';
import getImageActions from './image.actions';
import getJavascriptActions from './javascript.actions';
import getJiraCloudActions from './jira-cloud.actions';
import getJiraServerActions from './jira-server.actions';
import getLoopActions from './loop.actions';
import getMailActions from './mail.actions';
import getPowerPointActions from './powerpoint.actions';
import getSapActions from './SapActions/sap.actions';
import { IBpmnAction } from './types';
import getVariablesActions from './variables.actions';
import getVisualBasicActions from './visualBasic.actions';
import getWindowsActions from './windows.actions';
import getZipActions from './zip.actions';

const internalBpmnActions: Readonly<Record<string, IBpmnAction>> = {
    ...getLoopActions(),
    ...getBeeOfficeActions(),
    ...getSapActions(),
    ...getApplicationActions(),
    ...getGeneralActions(),
    ...getVariablesActions(),
    ...getFileActions(),
    ...getFolderActions(),
    ...getCsvActions(),
    ...getCloudExcelActions(),
    ...getCloudFileActions(),
    ...getPowerPointActions(),
    ...getBrowserActions(),
    ...getJavascriptActions(),
    ...getMailActions(),
    ...getAsanaActions(),
    ...getGoogleSheetsActions(),
    ...getJiraCloudActions(),
    ...getJiraServerActions(),
    ...getApiActions(),
    ...getExcelActions(),
    ...getDesktopActions(),
    ...getVisualBasicActions(),
    ...getImageActions(),
    ...getZipActions(),
    ...getWindowsActions(),
};

export default internalBpmnActions;
