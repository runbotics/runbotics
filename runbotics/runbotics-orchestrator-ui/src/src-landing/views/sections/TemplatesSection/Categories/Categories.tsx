import React, { FC, useMemo } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import { categoriesTranslationKeys } from '../TemplatesSection.utils';
import styles from './Categories.module.scss';
import { CategoriesProps } from './Categories.types';

const Categories: FC<CategoriesProps> = ({ 
    selectedCategoryKey, 
    handleCategoryChange,
}) => {
    const { translate } = useTranslations();

    const categoriesList = useMemo(() => categoriesTranslationKeys.map((categoryKey) => {
        // @ts-ignore
        const categoryName = translate(`Landing.Templates.CategoriesBar.Category.${categoryKey}`);

        return (
            <div
                key={categoryKey} 
                onClick={() => handleCategoryChange(categoryKey)}
            >
                <Typography 
                    className={`${styles.category} ${categoryKey === selectedCategoryKey ? styles.selected : ''}`} 
                    data-text={categoryName}
                >
                    {categoryName}
                </Typography>
            </div>
        );
    }), [handleCategoryChange, selectedCategoryKey, translate]);

    return (
        <div className={styles.root}>
            {categoriesList}
        </div>
    );
};

export default Categories;
