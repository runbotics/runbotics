import blogTranslations from '#src-landing/translations/en/blog';
import feedbackTranslations from '#src-landing/translations/en/feedback';
import landingPageTranslations from '#src-landing/translations/en/landing';

import accountTranslations from './account.json';
import actionTranslations from './action.json';
import botTranslations from './bot.json';
import collectionTranslations from './collections';
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
import schedulerTranslations from './scheduler';
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
    ...feedbackTranslations,
};
export default translationResources;
