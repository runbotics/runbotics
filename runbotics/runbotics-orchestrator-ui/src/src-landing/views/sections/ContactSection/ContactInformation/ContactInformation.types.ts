import { StaticImageData } from 'next/image';

import ContactTranslation from '#src-landing/translations/en/contact.json';

export interface ContactInfo {
    id: string;
    icon: StaticImageData;
    text: keyof typeof ContactTranslation;
    iconAlt: keyof typeof ContactTranslation;
}
