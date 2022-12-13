import enBenefitsTranslations from '#src-landing/translations/en/benefits.json';
import enHeroTranslations from '#src-landing/translations/en/hero.json';
import enIntegrationTranslations from '#src-landing/translations/en/integration.json';
import plBenefitsTranslations from '#src-landing/translations/pl/benefits.json';
import plHeroTranslations from '#src-landing/translations/pl/hero.json';
import plIntegrationTranslations from '#src-landing/translations/pl/integration.json';

const landingPageTranslations = {
    ...enHeroTranslations,
    ...enIntegrationTranslations,
    ...enBenefitsTranslations,
    ...plHeroTranslations,
    ...plIntegrationTranslations,
    ...plBenefitsTranslations,
};

export default landingPageTranslations;
