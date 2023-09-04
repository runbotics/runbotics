import { FC } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './HeroContent.module.scss';
import { HERO_TITLE_ID } from '../HeroSection.utils';

const HeroSection: FC = () => {
    const { translate } = useTranslations();
    return (
        <div className={styles.root}>
            <Typography id={HERO_TITLE_ID} variant="h1" color="secondary" className={styles.title}>
                <div>{translate('Landing.Hero.Title.Part.1')}</div>
                <div className={styles.fontPrimary}>
                    {translate('Landing.Hero.Title.Part.2')}
                </div>
            </Typography>
            <Typography
                variant="body1"
                color="secondary"
                className={styles.subtitle}
                text={translate('Landing.Hero.Subtitle')}
            />
        </div>
    );
};

export default HeroSection;
