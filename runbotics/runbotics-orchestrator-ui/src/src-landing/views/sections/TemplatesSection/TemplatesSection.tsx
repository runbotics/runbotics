import React, { FC, useState, useMemo, useEffect } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import Categories from './Categories';
import SearchBar from './SearchBar';
import styles from './TemplatesSection.module.scss';
import { categoriesNames, templates } from './TemplatesSection.utils';
import TemplateTile from './TemplateTile';

const TemplatesSection: FC = () => {
    const { translate } = useTranslations();
    const [selectedCategory, setSelectedCategory] = useState<string>(categoriesNames.CATEGORY_ALL);
    const [searchValue, setSearchValue] = useState<string>('');
    const [tiles, setTiles] = useState<JSX.Element[]>([]);
    const [maxDisplayedTiles, setMaxDisplayedTiles] = useState<number>(6);

    const filteredTemplates = useMemo(() => templates
        .filter(template => selectedCategory === 'All' ? true : template.categories.includes(selectedCategory))
        .filter(template => template.title.toLowerCase().includes(searchValue.toLowerCase()) 
            || template.description.toLowerCase().includes(searchValue.toLowerCase())), [selectedCategory, searchValue]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleCategoryChange= (categoryKey: string) => {
        setSelectedCategory(categoryKey);
    };
    
    const handleResize = () => {
        setTimeout(() => {
            if (window.innerWidth < 768) {
                setMaxDisplayedTiles(2);
            } else if (window.innerWidth < 1444) {
                setMaxDisplayedTiles(4);
            } else {
                setMaxDisplayedTiles(6);
            }
        }, 300);
    };

    useEffect(() => {
        setTiles(
            filteredTemplates.slice(0, maxDisplayedTiles).map((template) => (
                <TemplateTile
                    key={template.title}
                    title={template.title}
                    description={template.description}
                    categories={template.categories}
                    integrations={template.integrations}
                    highlight={searchValue}
                />
            ))
        );
    }, [filteredTemplates, searchValue, maxDisplayedTiles]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
    }, []);

    return (
        <div className={styles.root}>
            <Typography variant="h2" className={styles.title}>
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
                <div className={styles.templatesGrid}>
                    {tiles}
                </div>
            </div>
        </div>
    );
};

export default TemplatesSection;
