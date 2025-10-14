import processActionsTranslations from './actions';
import processConfigureTranslations from './configure';
import rest from './process.json';
import processCollectionTranslations from '../collections';

const processTranslations = {
    ...rest,
    ...processActionsTranslations,
    ...processCollectionTranslations,
    ...processConfigureTranslations,
};

export default processTranslations;
