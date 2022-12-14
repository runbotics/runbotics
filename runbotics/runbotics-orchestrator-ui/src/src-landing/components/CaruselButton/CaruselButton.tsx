import { FC } from 'react';

import Image from 'next/image';

import backwardArrow from 'public/images/shapes/backwards-arrow.svg';
import forwardArrow from 'public/images/shapes/forwards-arrow.svg';

import styles from './CaruselButton.module.scss';
import { CaruselButtonProps } from './CaruselButton.types';


const CaruselButton: FC<CaruselButtonProps> = ({ onClick, direction }) => (
    <button className={styles.root} onClick={onClick}>
        <Image 
            src={direction === 'forward' ? forwardArrow : backwardArrow} 
            alt={direction} 
        />
    </button>
);

export default CaruselButton;
