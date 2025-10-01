import React from 'react';

import useTranslations from '#src-app/hooks/useTranslations';

import { FilterContainer, FilterChip } from './CategoryFilter.styles';
import { AI_ASSISTANT_CONSTANTS } from '../types';

interface CategoryFilterProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryClick: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategories,
    onCategoryClick,
}) => {
    const { translate } = useTranslations();

    return (
        <FilterContainer
            direction="row"
            spacing={1}
        >
            {categories.map((cat) => {
                const isSelected = cat === AI_ASSISTANT_CONSTANTS.ALL_CATEGORIES_KEY 
                    ? selectedCategories.length === 0 
                    : selectedCategories.includes(cat);
                    
                const displayLabel = cat === AI_ASSISTANT_CONSTANTS.ALL_CATEGORIES_KEY 
                    ? translate('AIAssistant.Filter.All')
                    : cat;
                    
                return (
                    <FilterChip
                        key={cat}
                        label={displayLabel}
                        clickable
                        onClick={() => onCategoryClick(cat)}
                        color={isSelected ? 'primary' : 'default'}
                        variant='filled'
                        size="medium"
                    />
                );
            })}
        </FilterContainer>
    );
};
