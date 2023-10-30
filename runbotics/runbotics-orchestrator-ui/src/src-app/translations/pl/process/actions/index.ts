import cloudFileActionsTranslations from './cloudFile';
import commonActionsTranslations from './common';
import excelActionsTranslations from './excel';
import actionGroupsTranslations from './groups';
import imageActionsTranslations from './image';
import microsoftTranslations from './microsoft';

const processActionsTranslations = {
    ...commonActionsTranslations,
    ...excelActionsTranslations,
    ...actionGroupsTranslations,
    ...cloudFileActionsTranslations,
    ...microsoftTranslations,
    ...imageActionsTranslations,
};

export default processActionsTranslations;
