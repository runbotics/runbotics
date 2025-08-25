import tenantsActionsTranslations from './actions';
import tenantsBrowseTranslations from './browse';
import tenantPluginDrawerTranslations from './licenses';
import tenantsListTranslations from './list';

const tenantsTranslations = {
    ...tenantsBrowseTranslations,
    ...tenantsListTranslations,
    ...tenantsActionsTranslations,
    ...tenantPluginDrawerTranslations
};

export default tenantsTranslations;
