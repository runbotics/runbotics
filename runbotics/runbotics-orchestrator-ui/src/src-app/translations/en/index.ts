import benefitsTranslations from '#src-landing/translations/pl/benefits.json';
import heroTranslations from '#src-landing/translations/pl/hero.json';

import accountTranslations from './account.json';
import actionTranslations from './action.json';
import botTranslations from './bot.json';
import commonTranslations from './common.json';
import componentsTranslations from './components.json';
import error404Translations from './error404.json';
import historyTranslations from './history.json';
import installTranslations from './install.json';
import loginTranslations from './login.json';
import navTranslations from './nav.json';
import paletteTranslations from './palette.json';
import processTranslations from './process.json';
import registerTranslations from './register.json';
import schedulerTranslations from './scheduler.json';
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
    ...heroTranslations,
    ...benefitsTranslations,
};
export default translationResources;
