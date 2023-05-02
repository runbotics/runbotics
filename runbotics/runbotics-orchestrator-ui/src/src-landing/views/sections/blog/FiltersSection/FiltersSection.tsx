import { VFC, useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { FilterQueryParamsEnum, Category } from '#contentful/common';
import useTranslations from '#src-app/hooks/useTranslations';
import Checkbox from '#src-landing/components/Checkbox';
import DateRange, { IDateRange } from '#src-landing/components/DateRange';
import SearchInput from '#src-landing/components/SearchInput';
import Typography from '#src-landing/components/Typography';

import styles from './FiltersSection.module.scss';

interface Props {
    categories: Category[];
}

const FiltersSection: VFC<Props> = ({ categories }) => {
    const { translate } = useTranslations();
    const { query, push } = useRouter();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<Partial<IDateRange>>();

    const searchParam = Array.isArray(query?.search)
        ? query.search[0]
        : query.search;

    useEffect(() => {
        if (query?.category) {
            setSelectedCategories(Array.isArray(query.category) ? query.category : [query.category]);
        } else {
            setSelectedCategories([]);
        }

        const initialDateRange: Partial<IDateRange> = {};
        if (query?.startDate && typeof query.startDate === 'string') {
            initialDateRange.startDate = query.startDate;
        }
        
        if (query?.endDate && typeof query.endDate === 'string') {
            initialDateRange.endDate = query.endDate;
        }
        setDateRange(initialDateRange);
    }, [query]);

    const handleCategoryCheckboxChange = (slug: string) => {
        if (selectedCategories.includes(slug)) {
            setSelectedCategories(prevState => prevState.filter(category => category !== slug));
        } else {
            setSelectedCategories(prevState => [...prevState, slug]);
        }
    };

    const pushFilters = (search?: string) => {
        const searchParams = new URLSearchParams();
        
        selectedCategories
            .forEach(category => searchParams.append(FilterQueryParamsEnum.Category, category));
        if (dateRange?.startDate) {
            searchParams.append(FilterQueryParamsEnum.StartDate, dateRange.startDate);
        }
        if (dateRange?.endDate) {
            searchParams.append(FilterQueryParamsEnum.EndDate, dateRange.endDate);
        }
        if (search) {
            searchParams.append(FilterQueryParamsEnum.Search, search);
        }

        push(`/blog${searchParams.toString() ? '?' + searchParams.toString() : ''}`);
    };

    useEffect(() => {
        pushFilters(searchParam);
    }, [selectedCategories.length, dateRange?.endDate, dateRange?.startDate]);

    const categoriesCheckboxes = categories.map(category => (
        <Checkbox
            key={category.slug}
            checked={selectedCategories.includes(category.slug)}
            onChange={() => handleCategoryCheckboxChange(category.slug)}
            label={category.title}
            title={category.title}
            singleLine
        />
    ));

    return (
        <div className={styles.root}>
            <SearchInput
                initialValue={searchParam}
                onClick={pushFilters}
            />
            <div className={styles.filtersHeader}>
                <Typography variant='h4'>
                    Filters
                </Typography>
                <Link
                    className={styles.clearLink}
                    href={'/blog'}
                >
                    Clear All
                </Link>
            </div>
            <div className={styles.filterSectionWrapper}>
                <Typography variant='h6'>
                    Category
                </Typography>
                <div>
                    {categoriesCheckboxes}
                </div>
            </div>
            <div className={styles.filterSectionWrapper}>
                <Typography variant='h6'>
                    Date
                </Typography>
                <DateRange
                    initialDateRange={dateRange}
                    onChange={setDateRange}
                />
            </div>
        </div>

    );
};

export default FiltersSection;
