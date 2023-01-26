import React, { FC, useState, useMemo, useEffect, useRef } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';
import { TEMPLATE_SECTION_ID } from '#src-landing/utils/utils';

import Categories from './Categories';
import SearchBar from './SearchBar';
import styles from './TemplatesSection.module.scss';
import { categoriesNames, templates, TEMPLATES_TITLE_ID } from './TemplatesSection.utils';
import TemplateTile from './TemplateTile';

const TemplatesSection: FC = () => {
    const { translate } = useTranslations();
    const [selectedCategory, setSelectedCategory] = useState<string>(categoriesNames.CATEGORY_ALL);
    const [searchValue, setSearchValue] = useState<string>('');
    const gridRef = useRef<HTMLDivElement>(null);
    const [maxDisplayedTiles, setMaxDisplayedTiles] = useState<number>(6);

    const checkTemplateIncludes = (attribute: string, seekedValue: string) => attribute
        .toLowerCase()
        .includes(seekedValue.toLowerCase());
    
    const filteredTemplates = useMemo(
        () => templates
            .filter(template => 
                selectedCategory === 'All' 
                    ? true 
                    : template.categories.includes(selectedCategory)
            )
            .filter(template => 
                checkTemplateIncludes(template.title, searchValue) 
                || checkTemplateIncludes(template.description, searchValue)
            ), 
        [selectedCategory, searchValue]
    );
    
    const tiles = useMemo(
        () => 
            filteredTemplates
                .slice(0, maxDisplayedTiles)
                .map((template) => (
                    <TemplateTile
                        key={template.title}
                        title={template.title}
                        description={template.description}
                        categories={template.categories}
                        integrations={template.integrations}
                        highlight={searchValue}
                    />
                )), 
        [filteredTemplates, searchValue, maxDisplayedTiles]
    );

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };
    
    const handleCategoryChange = (categoryKey: string) => {
        setSelectedCategory(categoryKey);
    };

    const handleResize = () => {
        setTimeout(() => {
            if (gridRef.current) {
                setMaxDisplayedTiles(
                    parseInt(
                        getComputedStyle(gridRef.current).getPropertyValue(
                            '--tiles-number'
                        )
                    )
                );
            }
        }, 300);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    }, []);
    
    return (
        <section className={styles.root} id={TEMPLATE_SECTION_ID} aria-labelledby={TEMPLATES_TITLE_ID}>
            <Typography id={TEMPLATES_TITLE_ID} variant="h2" className={styles.title}>
                <span className={styles.darkFont}>
                    {translate('Landing.Templates.Title.Part1')}
                </span>
                &nbsp;
                {translate('Landing.Templates.Title.Part2')}
            </Typography>
            <SearchBar 
                handleSearch={handleSearch}
                searchValue={searchValue}
            />
            <div className={styles.templatesGridWrapper}>
                <Categories 
                    selectedCategoryKey={selectedCategory}
                    handleCategoryChange={handleCategoryChange}
                />
                <div className={styles.templatesGrid} ref={gridRef}>
                    {tiles}
                </div>
            </div>
        </section>
    );
};

export default TemplatesSection;
