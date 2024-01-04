import cloudFileActionsTranslations from './cloudFile';
import commonActionsTranslations from './common';
import excelActionsTranslations from './excel';
import actionGroupsTranslations from './groups';
import imageActionsTranslations from './image';
import jiraCloudActionsTranslations from './jiraCloud';
import jiraServerActionsTranslations from './jiraServer';
import microsoftTranslations from './microsoft';

const processActionsTranslations = {
    ...commonActionsTranslations,
    ...excelActionsTranslations,
    ...actionGroupsTranslations,
    ...cloudFileActionsTranslations,
    ...microsoftTranslations,
    ...imageActionsTranslations,
    ...jiraCloudActionsTranslations,
    ...jiraServerActionsTranslations,
};

export default processActionsTranslations;
