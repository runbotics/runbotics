import { credentialsCollectons } from './credenitalsCollections';
import { credentials } from './credentials';
import { general } from './general';

const credenitalsTranslations = {
    ...general,
    ...credentials,
    ...credentialsCollectons
};

export default credenitalsTranslations;
