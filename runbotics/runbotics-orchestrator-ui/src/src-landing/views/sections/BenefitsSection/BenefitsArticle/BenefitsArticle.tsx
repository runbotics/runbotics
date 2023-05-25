import { FC } from 'react';

import Image from 'next/image';

import { translate } from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './BenefitsArticle.module.scss';
import { Article } from './BenefitsArticle.types';


const BenefitsArticle: FC<Article> = ({ 
    titleKey, 
    descriptionKey, 
    imageSrc, 
    imageAlt 
}) => (
    <article className={styles.content}>
        <div className={styles.iconWrapper}>
            <Image
                src={imageSrc}
                height={36}
                width={36}
                alt={imageAlt}
            />
        </div>
        <Typography variant="h3" className={styles.title} color="accent">
            {translate(titleKey)}
        </Typography>
        <Typography
            variant="body3"
            className={styles.description}
            font="Roboto"
        >
            {translate(descriptionKey)}
        </Typography>
    </article>
);

export default BenefitsArticle;
