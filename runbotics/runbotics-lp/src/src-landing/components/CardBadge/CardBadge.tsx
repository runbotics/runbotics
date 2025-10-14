import React, { FC } from 'react';

import styles from './CardBadge.module.scss';
import Typography from '../Typography';

interface CardBadgeProps {
    text: string;
    backgroundColor?: string;
    textColor?: string;
    className?: string;
}
const DEFAULT_BACKGROUND_COLOR = '#1E6BF0';
const DEFAULT_TEXT_COLOR = '#FFF';

const CardBadge: FC<CardBadgeProps> = ({
    backgroundColor = DEFAULT_BACKGROUND_COLOR,
    textColor = DEFAULT_TEXT_COLOR,
    text,
    className,
}) => (
    <div
        className={`${styles.root} ${className}`}
        style={{ backgroundColor, color: textColor }}
    >
        <Typography variant="body5" className={styles.badge}>{text.toUpperCase()}</Typography>
    </div>
);

export default CardBadge;
