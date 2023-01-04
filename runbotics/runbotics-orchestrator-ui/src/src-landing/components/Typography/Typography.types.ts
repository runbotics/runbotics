type TypographyVariant =
    'h1' |
    'h2' |
    'h3' |
    'h4' |
    'h5' |
    'h6' |
    'p' |
    'body1' |
    'body2' |
    'body3'

type TypographyColor =
    'primary' |
    'secondary' |
    'accent' |
    'error' |
    'success'

export interface TypographyProps {
    variant?: TypographyVariant;
    color?: TypographyColor;
    font?: 'Roboto' | 'Montserrat';
    className?: string;
    text?: string;
}
