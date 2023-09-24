import cloudFileTranslations from './cloudFile';
import commonActionsTranslations from './common';
import excelActionsTranslations from './excel';
import actionGroupsTranslations from './groups';
import microsoftTranslations from './microsoft';

const processActionsTranslations = {
    ...commonActionsTranslations,
    ...excelActionsTranslations,
    ...actionGroupsTranslations,
    ...cloudFileTranslations,
    ...microsoftTranslations,
};

export default processActionsTranslations;
