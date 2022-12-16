import benefitsTranslations from './benefits.json';
import heroTranslations from './hero.json';
import industriesTranslation from './industries.json';
import integrationTranslations from './integration.json';
import prosTranslations from './pros.json';
import rpaTranslations from './rpa.json';

const landingPageTranslations = {
    ...heroTranslations,
    ...integrationTranslations,
    ...benefitsTranslations,
    ...prosTranslations,
    ...industriesTranslation
    ...rpaTranslations,
};

export default landingPageTranslations;
