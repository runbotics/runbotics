import { FC } from 'react';

import Carousel from '#src-landing/components/Carousel/Carousel';
import { CarouselSlide } from '#src-landing/components/Carousel/Carousel.types';
import { BENEFITS_SECTION_ID } from '#src-landing/utils/utils';

import BenefitsArticle from './BenefitsArticle';
import BenefitsContent from './BenefitsContent';

import styles from './BenefitsSection.module.scss';
import { BENEFITS_TITLE_ID, BENEFITS_ARTICLES } from './BenefitsSection.utils';

const BenefitsSection: FC = () => {
    const slides: CarouselSlide[] = BENEFITS_ARTICLES.map((article) => ({
        content: (
            <BenefitsArticle
                titleKey={article.titleKey}
                descriptionKey={article.descriptionKey}
                imageSrc={article.imageSrc}
                imageAlt={article.imageAlt}
            />
        ),
    }));

    return (
        <section
            className={styles.root}
            id={BENEFITS_SECTION_ID}
            aria-labelledby={BENEFITS_TITLE_ID}
        >
            <BenefitsContent />
            <Carousel slides={slides} />
        </section>
    );
};

export default BenefitsSection;
