import englishTranslationResources from '#src-app/translations/en';
import polishTranslationResources from '#src-app/translations/pl';

export interface TooltipIconProps {
    translationKey: keyof (typeof englishTranslationResources | typeof polishTranslationResources);
    icon: React.ElementType;
}

export type TootltipIcon = JSX.Element;
