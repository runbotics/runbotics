import cloudFileTranslations from './cloudFile';
import commonActionsTranslations from './common';
import excelActionsTranslations from './excel';
import actionGroupsTranslations from './groups';
import imageActionsTranslations from './image';
import microsoftTranslations from './microsoft';

const processActionsTranslations = {
    ...commonActionsTranslations,
    ...excelActionsTranslations,
    ...actionGroupsTranslations,
    ...cloudFileTranslations,
    ...microsoftTranslations,
    ...imageActionsTranslations,
};

export default processActionsTranslations;
