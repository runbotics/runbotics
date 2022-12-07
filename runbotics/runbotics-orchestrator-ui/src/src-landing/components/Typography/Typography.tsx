import React, { FC } from 'react';

import styles from './Typography.module.scss';
import { TypographyProps } from './Typography.types';
import { typographyVariantsMap } from './Typography.utils';

const Typography: FC<TypographyProps> = ({
    variant,
    color,
    children,
    font = 'Montserrat',
    className,
    text,
    ...props
}) => {
    const TypographyRoot = typographyVariantsMap[variant] || 'p'; 
    const classes = [
        styles.root,
        styles[`typography__${variant}`],
        styles[`typography__${color}`],
        styles[`typography__${font}`],
        className ?? ''
    ].join(' ');
    
    return (
        <TypographyRoot className={classes} {...props}>
            {text ?? children}
        </TypographyRoot>
    );
};

export default Typography;
