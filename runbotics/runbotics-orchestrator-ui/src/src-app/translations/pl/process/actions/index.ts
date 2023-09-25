import cloudFileActionsTranslations from './cloudFile';
import commonActionsTranslations from './common';
import excelActionsTranslations from './excel';
import actionGroupsTranslations from './groups';
import microsoftTranslations from './microsoft';

const processActionsTranslations = {
    ...commonActionsTranslations,
    ...excelActionsTranslations,
    ...actionGroupsTranslations,
    ...cloudFileActionsTranslations,
    ...microsoftTranslations,
};

export default processActionsTranslations;
