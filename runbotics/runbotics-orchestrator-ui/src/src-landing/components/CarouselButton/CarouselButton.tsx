import { FC } from 'react';

import Image from 'next/image';

import backwardArrow from 'public/images/shapes/backwards-arrow.svg';
import forwardArrow from 'public/images/shapes/forwards-arrow.svg';

import styles from './CarouselButton.module.scss';
import { CarouselButtonProps } from './CarouselButton.types';

const CarouselButton: FC<CarouselButtonProps> = ({ onClick, direction }) => (
    <button className={direction === 'forward' ? styles.forwardArrow : styles.backwardArrow} onClick={onClick}>
        <Image
            src={direction === 'forward' ? forwardArrow : backwardArrow}
            alt={direction}
        />
    </button>
);

export default CarouselButton;
