import editListTranslations from './edit';
import tableListTranslations from './table';
import viewListTranslations from './view';

const tenantsListTranslations = {
    ...viewListTranslations,
    ...tableListTranslations,
    ...editListTranslations,
};

export default tenantsListTranslations;
