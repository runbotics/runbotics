import tenantsActionsTranslations from './actions';
import tenantsBrowseTranslations from './browse';
import tenantsListTranslations from './list';

const tenantsTranslations = {
    ...tenantsBrowseTranslations,
    ...tenantsListTranslations,
    ...tenantsActionsTranslations,
};

export default tenantsTranslations;
