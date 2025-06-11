import { FC } from 'react';

import Image from 'next/image';

import benefitsArrows from '#public/images/shapes/benefits-arrows.svg';
import { translate } from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './BenefitsContent.module.scss';
import { BENEFITS_TITLE_ID } from '../BenefitsSection.utils';

const BenefitsContent: FC = () => (
    <article className={styles.root}>
        <Typography id={BENEFITS_TITLE_ID} variant="h2" className={styles.title}>
            {translate('Landing.Benefits.Title')}
        </Typography>
        <div className={styles.content}>
            <Typography variant="body2">
                {translate('Landing.Benefits.Subtitle.Part.1')}
            </Typography>
            <Typography variant="body2">
                {translate('Landing.Benefits.Subtitle.Part.2')}
            </Typography>
        </div>
        <Image src={benefitsArrows} className={styles.arrows} alt="" />
    </article>
);

export default BenefitsContent;
