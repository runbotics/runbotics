import React, { FC } from 'react';

import styles from './GenericTile.module.scss';
import { GenericTileProps } from './GenericTile.types';

const GenericTile: FC<GenericTileProps> = ({
    children,
    className,
    dataShadow,
}) => (
    <div
        className={`${styles.root} ${className}`}
        data-shadow={dataShadow}
    >
        {children}
    </div>
);

export default GenericTile;
