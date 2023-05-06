import React, { FC } from 'react';

import Typography from '../Typography';
import styles from './CardBadge.module.scss';

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
        <Typography variant="body5">{text.toUpperCase()}</Typography>
    </div>
);

export default CardBadge;
