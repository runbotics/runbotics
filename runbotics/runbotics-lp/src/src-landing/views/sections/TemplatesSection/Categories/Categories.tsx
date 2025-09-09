import React, { FC, useMemo } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';
import { checkTranslationKey, categoriesTranslationKeys } from '#src-landing/views/sections/TemplatesSection/TemplatesSection.utils';

import styles from './Categories.module.scss';
import { CategoriesProps } from './Categories.types';


const Categories: FC<CategoriesProps> = ({ 
    selectedCategoryKey, 
    handleCategoryChange,
}) => {
    const { translate } = useTranslations();

    const translatedCategories = useMemo(() => categoriesTranslationKeys.map((categoryKey) => {
        const translateKey = `Landing.Templates.CategoriesBar.Category.${categoryKey}`;
        return checkTranslationKey(translateKey) 
            ? translate(translateKey) 
            : categoryKey;
    }), [translate]);
        
    
    return (
        <div className={styles.root}>
            {
                categoriesTranslationKeys.map((categoryKey, index) => (
                    <div
                        key={categoryKey} 
                        onClick={() => handleCategoryChange(categoryKey)}
                    >
                        <Typography 
                            className={`${styles.category} ${categoryKey === selectedCategoryKey ? styles.selected : ''}`} 
                            data-text={translatedCategories[index]}
                        >
                            {translatedCategories[index]}
                        </Typography>
                    </div>
                ))
            }
        </div>
    );
};

export default Categories;
