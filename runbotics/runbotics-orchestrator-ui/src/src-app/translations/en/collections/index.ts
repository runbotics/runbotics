import createCollectionResponse from './createCollectionsResponse';
import general from './general';
import processCollection from './processCollection';

const processCollectionTranslations = {
    ...general,
    ...createCollectionResponse,
    ...processCollection,
};

export default processCollectionTranslations;
