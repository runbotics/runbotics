import actionFormSelect from './actionFormSelect';
import credentialsCollections from './collections';
import credentials from './credentials';
import general from './general';

const credenitalsTranslations = {
    ...general,
    ...credentials,
    ...credentialsCollections,
    ...actionFormSelect,
};

export default credenitalsTranslations;
