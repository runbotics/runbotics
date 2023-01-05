import React, { FC } from 'react';

import Image from 'next/image';

import { integrationLogos } from '#public/images/logos';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import HighlightedText from './HighlightedText';
import styles from './TemplateTile.module.scss';
import { TemplateTileProps } from './TemplateTile.types';

const TemplateTile:FC<TemplateTileProps> = ({
    title,
    description,
    categories,
    integrations,
    highlight,
}) => {
    const { translate } = useTranslations();

    // @ts-ignore
    const translatedCategories = categories.map((categoryKey) => translate(`Landing.Templates.CategoriesBar.Category.${categoryKey}`)).join(', ');

    return (
        <div className={styles.root}>
            <div className={styles.tileContent}>
                <Typography variant="h4" className={styles.templateTitle}>
                    <HighlightedText 
                        textSource={title}
                        styleClass={styles.textHighlight}
                        highlight={highlight}
                    />
                </Typography>
                <Typography className={styles.templateDescription}>
                    <HighlightedText 
                        textSource={description}
                        styleClass={styles.textHighlight}
                        highlight={highlight}
                    />
                </Typography>
            </div>
            <div className={styles.tileDetails}>
                <If condition={categories.length > 0}>
                    <Typography>
                        {translate('Landing.Templates.TemplatesGrid.TemplateTile.Category')}
                        <span className={styles.boldText}>
                            &nbsp;{translatedCategories}
                        </span>
                    </Typography>
                </If>
                <Typography>
                    {translate('Landing.Templates.TemplatesGrid.TemplateTile.Integrations')}
                </Typography>
                <div className={styles.integrations}>
                    {integrations.map((integration) => (
                        <Image 
                            key={integration} 
                            src={integrationLogos[integration]} 
                            alt={integration}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplateTile;
