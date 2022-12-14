import React, { FC } from 'react';

import styles from './GenericTile.module.scss';
import { GenericTileProps } from './GenericTile.types';

const GenericTile: FC<GenericTileProps> = ({ children, className }) => {
	return <div className={`${styles.root} ${className}`}>{children}</div>;
};

export default GenericTile;
