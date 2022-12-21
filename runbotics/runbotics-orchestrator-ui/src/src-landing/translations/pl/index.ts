import benefitsTranslations from './benefits.json';
import headerTranslations from './header.json';
import heroTranslations from './hero.json';
import integrationTranslations from './integration.json';
import prosTranslations from './pros.json';

const landingPageTranslations = {
    ...headerTranslations,
    ...heroTranslations,
    ...integrationTranslations,
    ...benefitsTranslations,
    ...prosTranslations,
};

export default landingPageTranslations;
