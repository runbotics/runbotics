import benefitsTranslations from './benefits.json';
import heroTranslations from './hero.json';
import integrationTranslations from './integration.json';

const landingPageTranslations = {
    ...heroTranslations,
    ...integrationTranslations,
    ...benefitsTranslations
};

export default landingPageTranslations;
