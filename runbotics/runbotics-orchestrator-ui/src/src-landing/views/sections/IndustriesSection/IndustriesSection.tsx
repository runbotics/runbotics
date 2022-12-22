import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import { SLIDES } from '#src-landing/views/sections/IndustriesSection/IndustriesSection.utils';

import IndustriesCarousel from './IndustriesCarousel/IndustiresCarousel';
import styles from './IndustriesSection.module.scss';

const IndustriesSection = () => {
    const { translate } = useTranslations();
    return (
        <section className={styles.root}>
            <div className={styles.title}>
                <Typography variant="h2">
                    <div>{translate('Landing.Industries.Title.Part.1')}</div>
                    {translate('Landing.Industries.Title.Part.2')}
                </Typography>
            </div>
            <div className={styles.background}></div>
            <IndustriesCarousel slides={SLIDES} />
        </section>
    );
};

export default IndustriesSection;
