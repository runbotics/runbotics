import aboutTeamTranslations from './about-team.json';
import benefitsTranslations from './benefits.json';
import blogTranslations from './blog.json';
import contactTranslations from './contact.json';
import footerTranslations from './footer.json';
import headerTranslations from './header.json';
import heroTranslations from './hero.json';
import integrationTranslations from './integration.json';
import marketplaceTranslations from './marketplace.json';
import openSourceTranslations from './open-source.json';
import partnerTranslations from './partner.json';
import policyTranslations from './policy.json';
import prosTranslations from './pros.json';
import rpaTranslations from './rpa.json';
import templatesTranslations from './templates.json';

const landingPageTranslations = {
    ...headerTranslations,
    ...heroTranslations,
    ...integrationTranslations,
    ...benefitsTranslations,
    ...openSourceTranslations,
    ...partnerTranslations,
    ...prosTranslations,
    ...templatesTranslations,
    ...contactTranslations,
    ...rpaTranslations,
    ...footerTranslations,
    ...blogTranslations,
    ...aboutTeamTranslations,
    ...policyTranslations,
    ...marketplaceTranslations,
};

export default landingPageTranslations;
