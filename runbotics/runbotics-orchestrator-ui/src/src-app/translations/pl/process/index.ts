import processActionsTranslations from './actions';
import rest from './process.json';

const processTranslations = {
    ...rest,
    ...processActionsTranslations,
};

export default processTranslations;
