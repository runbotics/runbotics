import processActionsTranslations from './actions';
import rest from './process.json';
import processCollectionTranslations from '../collections';

const processTranslations = {
    ...rest,
    ...processActionsTranslations,
    ...processCollectionTranslations,
};

export default processTranslations;
