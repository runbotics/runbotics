import benefitsTranslations from './benefits.json';
import contactTranslations from './contact.json';
import heroTranslations from './hero.json';
import industriesTranslation from './industries.json';
import integrationTranslations from './integration.json';
import prosTranslations from './pros.json';

const landingPageTranslations = {
    ...heroTranslations,
    ...integrationTranslations,
    ...benefitsTranslations,
    ...prosTranslations,
    ...industriesTranslation,
    ...contactTranslations
};

export default landingPageTranslations;
