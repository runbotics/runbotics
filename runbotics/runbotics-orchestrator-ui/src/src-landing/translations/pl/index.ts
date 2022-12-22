import benefitsTranslations from './benefits.json';
import contactTranslations from './contact.json';
import footerTranslations from './footer.json';
import headerTranslations from './header.json';
import heroTranslations from './hero.json';
import industriesTranslation from './industries.json';
import integrationTranslations from './integration.json';
import openSourceTranslations from './open-source.json';
import partnerTranslations from './partner.json';
import prosTranslations from './pros.json';
import templatesTranslations from './templates.json';
import rpaTranslations from './rpa.json';

const landingPageTranslations = {
    ...headerTranslations,
    ...heroTranslations,
    ...integrationTranslations,
    ...benefitsTranslations,
    ...openSourceTranslations,
    ...partnerTranslations,
    ...prosTranslations,
    ...industriesTranslation,
    ...templatesTranslations,
    ...industriesTranslation,
    ...contactTranslations,
    ...rpaTranslations,
    ...footerTranslations
};

export default landingPageTranslations;
