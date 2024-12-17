import { checkIfKeyExists, translate } from '#src-app/hooks/useTranslations';
import { capitalizeFirstLetter } from '#src-landing/utils/utils';

export const getTranslatedTemplateName = (template: string) => {
    const templateTranslationKey = `Credential.Template.${capitalizeFirstLetter(template)}.Name`;
    const templateName = checkIfKeyExists(templateTranslationKey)
        ? translate(templateTranslationKey)
        : template;

    return templateName;
};
