import React, { FC } from 'react';

import styles from './Typography.module.scss';
import { TypographyProps } from './Typography.types';

const Typography: FC<TypographyProps> = ({
    variant,
    color,
    children,
    font = 'Montserrat',
    className,
    ...props
}) => {
    const TypographyRoot = variant || 'p'; 
    const classes = [
        styles.root,
        styles[`typography__${variant}`],
        styles[`typography__${color}`],
        styles[`typography__${font}`],
        className ?? ''
    ].join(' ');
    
    return (
        <TypographyRoot className={classes} {...props}>
            {children}
        </TypographyRoot>
    );
};

export default Typography;
