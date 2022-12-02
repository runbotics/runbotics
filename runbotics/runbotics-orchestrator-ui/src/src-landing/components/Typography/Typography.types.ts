type TypographyVariant =
    'h1' |
    'h2' |
    'h3' |
    'h4' |
    'h5' |
    'h6' |
    'p'

type TypographyColor =
    'primary' |
    'secondary' |
    'accent'

export interface TypographyProps {
    variant?: TypographyVariant;
    color?: TypographyColor;
    font?: 'Roboto' | 'Montserrat';
    className?: string;
}
