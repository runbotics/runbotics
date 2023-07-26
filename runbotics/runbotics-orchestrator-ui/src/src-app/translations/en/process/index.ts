import commonActionsTranslations from './actions/common';
import rest from './process.json';

const processTranslations = {
    ...rest,
    ...commonActionsTranslations,
};

export default processTranslations;
