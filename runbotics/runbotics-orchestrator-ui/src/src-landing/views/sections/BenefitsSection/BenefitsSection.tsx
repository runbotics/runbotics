import { FC } from 'react';

import Carousel from '#src-landing/components/Carousel/Carousel';

import { BENEFITS_SECTION_ID } from '#src-landing/utils/utils';

import BenefitsArticle from './BenefitsArticle';
import carouselStyles from './BenefitsCarousel/BenefitsCarousel.module.scss';
import BenefitsContent from './BenefitsContent';

import styles from './BenefitsSection.module.scss';
import { BENEFITS_TITLE_ID, BENEFITS_ARTICLES } from './BenefitsSection.utils';

const BenefitsSection: FC = () => {
    const slides: JSX.Element[] = BENEFITS_ARTICLES.map((article) => (
        <BenefitsArticle
            key={article.titleKey}
            titleKey={article.titleKey}
            descriptionKey={article.descriptionKey}
            imageSrc={article.imageSrc}
            imageAlt={article.imageAlt}
        />
    ));

    return (
        <section
            className={styles.root}
            id={BENEFITS_SECTION_ID}
            aria-labelledby={BENEFITS_TITLE_ID}
        >
            <BenefitsContent />
            <Carousel slides={slides} styles={carouselStyles} hasCounter />
        </section>
    );
};

export default BenefitsSection;
