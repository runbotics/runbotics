import cloudFileActionsTranslations from './cloudFile';
import commonActionsTranslations from './common';
import excelActionsTranslations from './excel';
import folderActionsTranslations from './folder';
import googleActionsTranslations from './google';
import actionGroupsTranslations from './groups';
import imageActionsTranslations from './image';
import jiraCloudActionsTranslations from './jiraCloud';
import jiraServerActionsTranslations from './jiraServer';
import microsoftTranslations from './microsoft';
import zipActionsTranslations from './zip';

const processActionsTranslations = {
    ...commonActionsTranslations,
    ...excelActionsTranslations,
    ...actionGroupsTranslations,
    ...cloudFileActionsTranslations,
    ...microsoftTranslations,
    ...imageActionsTranslations,
    ...jiraCloudActionsTranslations,
    ...jiraServerActionsTranslations,
    ...folderActionsTranslations,
    ...zipActionsTranslations,
    ...googleActionsTranslations,
};

export default processActionsTranslations;
