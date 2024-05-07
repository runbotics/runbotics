import { credentialsCollectons } from './credenitalsCollections';
import { credentials } from './credentials';
import rest from './credentials.json';
import { general } from './general';

const credenitalsTranslations = {
    ...rest,
    ...general,
    ...credentials,
    ...credentialsCollectons
};

export default credenitalsTranslations;
