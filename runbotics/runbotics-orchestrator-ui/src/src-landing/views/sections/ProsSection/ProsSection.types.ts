import { StaticImageData } from 'next/image';

import prosTranslations from '#src-landing/translations/en/landing/pros.json';

export interface ProsTile {
    title: keyof typeof prosTranslations;
    description: keyof typeof prosTranslations;
    icon: StaticImageData;
    iconAlt: keyof typeof prosTranslations;
}
