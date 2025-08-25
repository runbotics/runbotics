import { FC } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';
import { RPA_TITLE_ID } from '#src-landing/views/sections/RPASection/RPASection.utils';

import styles from './RPAContent.module.scss';

const RPAContent: FC = () => {
    const { translate } = useTranslations();

    return (
        <div>
            <div className={styles.title} id={RPA_TITLE_ID}>
                <Typography>
                    {translate('Landing.RPA.Title.Part1')}
                </Typography>
                <Typography>
                    {translate('Landing.RPA.Title.Part2')}
                </Typography>
            </div>
            <div className={styles.paragraphs}>
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
    );
};

export default RPAContent;
