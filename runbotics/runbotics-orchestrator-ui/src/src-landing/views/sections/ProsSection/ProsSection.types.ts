import prosTranslations from '#src-landing/translations/en/pros.json';

export interface ProsTile {
    title: keyof typeof prosTranslations;
    description: keyof typeof prosTranslations;
    icon: string;
    iconAlt: keyof typeof prosTranslations;
}
