import { TypographyElement, TypographyVariant } from './Typography.types';

export const typographyVariantsMap: Record<TypographyVariant, TypographyElement> = {
    'h1': 'h1',
    'h2': 'h2',
    'h3': 'h3',
    'h4': 'h4',
    'h5': 'h5',
    'h6': 'h6',
    'p': 'p',
    'body1': 'p',
    'body2': 'p',
    'body3': 'p',
    'body4': 'p',
    'body5': 'p',
} as const;
