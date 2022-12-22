import { FC } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './RPAContent.module.scss';

const RPAContent: FC = () => {
    const { translate } = useTranslations();

    return (
        <div className={styles.root}>
            <div className={styles.contentWrapper}>
                <Typography variant="h2" className={styles.title}>
                    {translate('Landing.RPA.Title')}
                </Typography>
                <div className={styles.content}>
                    <div className={styles.paragraph1}>
                        <Typography>
                            {translate('Landing.RPA.Content.Paragraph1.Part1')}
                        </Typography>
                        <Typography>
                            {translate('Landing.RPA.Content.Paragraph1.Part2')}
                        </Typography>
                        <Typography>
                            {translate('Landing.RPA.Content.Paragraph1.Part3')}
                        </Typography>
                    </div>
                    <Typography>
                        {translate('Landing.RPA.Content.Paragraph2')}
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default RPAContent;
