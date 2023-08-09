import blogTranslations from '#src-landing/translations/pl/blog';
import landingPageTranslations from '#src-landing/translations/pl/landing';

import accountTranslations from './account.json';
import actionTranslations from './action.json';
import botTranslations from './bot.json';
import commonTranslations from './common.json';
import componentsTranslations from './components.json';
import demoTranslations from './demo.json';
import error404Translations from './error404.json';
import historyTranslations from './history.json';
import installTranslations from './install.json';
import loginTranslations from './login.json';
import navTranslations from './nav.json';
import paletteTranslations from './palette.json';
import processTranslations from './process';
import registerTranslations from './register.json';
import schedulerTranslations from './scheduler.json';
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
    ...error404Translations,
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
};

export default translationResources;
