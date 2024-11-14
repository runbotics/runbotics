import blogTranslations from '#src-landing/translations/pl/blog';
import feedbackTranslations from '#src-landing/translations/pl/feedback';
import landingPageTranslations from '#src-landing/translations/pl/landing';

import accountTranslations from './account.json';
import actionTranslations from './action.json';
import botTranslations from './bot.json';
import collectionTranslations from './collections';
import commonTranslations from './common.json';
import componentsTranslations from './components.json';
import credenitalsTranslations from './credenitals';
import demoTranslations from './demo.json';
import historyTranslations from './history.json';
import httpErrorsTranslations from './httpErrors.json';
import installTranslations from './install.json';
import loginTranslations from './login.json';
import navTranslations from './nav.json';
import paletteTranslations from './palette.json';
import processTranslations from './process';
import registerTranslations from './register.json';
import schedulerTranslations from './scheduler';
import tenantsTranslations from './tenants';
import usersTranslations from './users';
import variablesTranslations from './variables.json';

const translationResources = {
    ...commonTranslations,
    ...navTranslations,
    ...registerTranslations,
    ...loginTranslations,
    ...accountTranslations,
    ...historyTranslations,
    ...botTranslations,
    ...processTranslations,
    ...collectionTranslations,
    ...httpErrorsTranslations,
    ...actionTranslations,
    ...schedulerTranslations,
    ...variablesTranslations,
    ...installTranslations,
    ...componentsTranslations,
    ...paletteTranslations,
    ...landingPageTranslations,
    ...blogTranslations,
    ...demoTranslations,
    ...usersTranslations,
    ...tenantsTranslations,
    ...credenitalsTranslations,
    ...feedbackTranslations,
};

export default translationResources;
