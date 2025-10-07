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
            {categories.map((category) => {
                const isSelected = category === AI_ASSISTANT_CONSTANTS.ALL_CATEGORIES_KEY 
                    ? selectedCategories.length === 0 
                    : selectedCategories.includes(category);
                    
                const displayLabel = category === AI_ASSISTANT_CONSTANTS.ALL_CATEGORIES_KEY 
                    ? translate('AIAssistant.Filter.All')
                    : category;
                    
                return (
                    <FilterChip
                        key={category}
                        label={displayLabel}
                        clickable
                        onClick={() => onCategoryClick(category)}
                        color={isSelected ? 'secondary' : 'default'}
                        variant='filled'
                        size="medium"
                    />
                );
            })}
        </FilterContainer>
    );
};
