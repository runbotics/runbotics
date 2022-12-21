import benefitsTranslations from './benefits.json';
import headerTranslations from './header.json';
import heroTranslations from './hero.json';
import industriesTranslation from './industries.json';
import integrationTranslations from './integration.json';
import prosTranslations from './pros.json';
import rpaTranslations from './rpa.json';

const landingPageTranslations = {
    ...headerTranslations,
    ...heroTranslations,
    ...integrationTranslations,
    ...benefitsTranslations,
    ...prosTranslations,
    ...rpaTranslations,
    ...industriesTranslation
};

export default landingPageTranslations;
