import { FC, useState } from 'react';

import Image from 'next/image';

import { translate } from '#src-app/hooks/useTranslations';
import CarouselButton from '#src-landing/components/CarouselButton';
import MobileCarouselNav from '#src-landing/components/MobileCarouselNav';
import Typography from '#src-landing/components/Typography';

import styles from './BenefitsCarousel.module.scss';
import { Slide } from './BenefitsCarousel.types';

const SLIDES: Slide[] = [
    {
        descriptionKey: 'Landing.Benefits.Slides.Repetitive.Description',
        imageSrc: '/images/shapes/beach_access.svg',
        imageAlt: 'beach icon',
        titleKey: 'Landing.Benefits.Slides.Repetitive.Title',
    },
    {
        descriptionKey: 'Landing.Benefits.Slides.Efficiency.Description',
        imageSrc: '/images/shapes/hourglass.svg',
        imageAlt: 'Hourglass icon',
        titleKey: 'Landing.Benefits.Slides.Efficiency.Title',
    },
    {
        descriptionKey: 'Landing.Benefits.Slides.Accuracy.Description',
        imageSrc: '/images/shapes/layers.svg',
        imageAlt: 'Layers icon',
        titleKey: 'Landing.Benefits.Slides.Accuracy.Title',
    },
];

const BenefitsCarousel: FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const incrementSlide = () => {
        if (currentSlide === SLIDES.length - 1) {
            setCurrentSlide(0);
        } else {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const decrementSlide = () => {
        if (currentSlide === 0) {
            setCurrentSlide(SLIDES.length - 1);
        } else {
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.buttonWrapper}>
                <CarouselButton direction="backward" onClick={decrementSlide} />
            </div>
            <div className={styles.contentWrapper}>
                <article className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <Image
                            src={SLIDES[currentSlide].imageSrc}
                            height={36}
                            width={36}
                            alt={SLIDES[currentSlide].imageAlt}
                        />
                    </div>
                    <Typography
                        variant="h3"
                        className={styles.title}
                        color="accent"
                    >
                        {translate(SLIDES[currentSlide].titleKey)}
                    </Typography>
                    <Typography
                        variant="body3"
                        className={styles.description}
                        font="Roboto"
                    >
                        {translate(SLIDES[currentSlide].descriptionKey)}
                    </Typography>
                </article>
            </div>
            <div className={styles.buttonWrapper}>
                <CarouselButton direction="forward" onClick={incrementSlide} />
                <Typography variant="body1" className={styles.counter}>
                    <span className={styles.counterCurrent}>
                        {currentSlide + 1}
                    </span>
                    /&nbsp;
                    {SLIDES.length}
                </Typography>
            </div>
            <MobileCarouselNav
                currentSlide={currentSlide}
                decrementSlide={decrementSlide}
                incrementSlide={incrementSlide}
                length={SLIDES.length}
            />
        </div>
    );
};

export default BenefitsCarousel;
