import type { StaticImageData } from 'next/image';

import industriesTranslation from '#src-landing/translations/en/industries.json';

type IndustriesTranslationKey = keyof typeof industriesTranslation;

interface SlideLinks {
    nameKey: IndustriesTranslationKey;
    href: IndustriesTranslationKey;
}

export interface IndustrySlide {
    titleKey: IndustriesTranslationKey;
    imgAltKey: IndustriesTranslationKey;
    img: StaticImageData;
    links: SlideLinks[];
}
