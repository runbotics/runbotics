import { FC } from 'react';

import Image from 'next/image';
import NextLink from 'next/link';

import forwardsArrow from '#public/images/shapes/forwards-arrow.svg';
import minusSign from '#public/images/shapes/minus.svg';
import plusSign from '#public/images/shapes/plus.svg';

import useTranslations from '#src-app/hooks/useTranslations';

import GenericTile from '#src-landing/components/GenericTile';
import Typography from '#src-landing/components/Typography';

import styles from './IndustriesSlide.module.scss';
import { IndustriesSlideProps } from './IndustriesSlide.types';

const IndustriesSlide: FC<IndustriesSlideProps> = ({
    index,
    openSlide,
    toggleSlide,
    activeIndex,
    sliderWidth,
    slide,
}) => {
    const { translate } = useTranslations();

    return (
        <GenericTile
            className={`${styles.slide} ${
                index === openSlide ? styles.slide__open : ''
            }`}
            dataShadow={(index === openSlide).toString()}
        >
            <div className={styles.imgWrapper}>
                <Image
                    src={slide.img}
                    alt={translate(slide.imgAltKey)}
                    className={styles.cardImg}
                    placeholder="blur"
                />
                <button
                    className={styles.showMoreButton}
                    onClick={() => toggleSlide(index)}
                >
                    <Typography variant="h4" color="secondary">
                        {translate(slide.titleKey)}
                    </Typography>
                    <Image
                        src={openSlide === index ? minusSign : plusSign}
                        alt="plus sign"
                        className={styles.plusSign}
                    />
                </button>
            </div>
            <div className={styles.content}>
                <ul className={styles.contentUl}>
                    {slide.links.map((link) => (
                        <li key={link.nameKey} className={styles.contentLi}>
                            <NextLink
                                href={translate(link.href)}
                                className={styles.contentLink}
                            >
                                <Typography variant="body3">
                                    {translate(link.nameKey)}
                                </Typography>
                                <Image src={forwardsArrow} alt="Right arrow" />
                            </NextLink>
                        </li>
                    ))}
                </ul>
            </div>
        </GenericTile>
    );
};

export default IndustriesSlide;
