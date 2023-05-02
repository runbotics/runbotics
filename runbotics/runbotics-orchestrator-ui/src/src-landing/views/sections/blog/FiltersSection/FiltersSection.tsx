import { VFC, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FilterQueryParamsEnum, Category } from '#contentful/common';
import MinusIcon from '#public/images/icons/minus.svg';
import PlusIcon from '#public/images/icons/plus.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import Checkbox from '#src-landing/components/Checkbox';
import DateRange, { IDateRange } from '#src-landing/components/DateRange';
import SearchInput from '#src-landing/components/SearchInput';
import Typography from '#src-landing/components/Typography';

import styles from './FiltersSection.module.scss';

interface Props {
    categories: Category[];
    onReload: () => void;
}

const FiltersSection: VFC<Props> = ({ categories, onReload }) => {
    const { translate } = useTranslations();
    const { query, push } = useRouter();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isCategoriesSectionExpanded, setCategoriesSectionExpand] = useState<boolean>(false);
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
        onReload();
    }, [onReload, query]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParam, selectedCategories.length, dateRange?.endDate, dateRange?.startDate]);

    const categoriesCheckboxes = categories.map((category, index) => (
        <Checkbox
            key={category.slug}
            className={index < 5 || isCategoriesSectionExpanded ? '' : styles.hidden}
            checked={selectedCategories.includes(category.slug)}
            onChange={() => handleCategoryCheckboxChange(category.slug)}
            label={category.title}
            title={category.title}
            size='regular'
            singleLine
        />
    ));

    return (
        <aside
            className={styles.root}
        >
            <SearchInput
                className={styles.searchForm}
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
                    Clear&nbsp;All
                </Link>
            </div>
            <div
                className={styles.filterSectionWrapper}
                data-type='category'
            >
                <Typography variant='h6'>
                    Category
                </Typography>
                <div className={styles.categoriesSectionWrapper}>
                    {categoriesCheckboxes}
                </div>
                <button
                    className={styles.expandSectionButton}
                    type='button'
                    data-hide={categories.length <= 5}
                    onClick={() => {
                        setCategoriesSectionExpand(prevState => !prevState);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <Image
                        src={isCategoriesSectionExpanded ? MinusIcon : PlusIcon}
                        alt={isCategoriesSectionExpanded ? 'minus' : 'plus'}
                        width={14}
                        height={14}
                    />
                    <Typography variant='body4' element='span' color='accent'>
                        {isCategoriesSectionExpanded ? 'Less' : 'More'}
                    </Typography>
                </button>
            </div>
            <div
                className={styles.filterSectionWrapper}
                data-type='date'
            >
                <Typography variant='h6'>
                    Date
                </Typography>
                <DateRange
                    initialDateRange={dateRange}
                    onChange={setDateRange}
                />
            </div>
        </aside>

    );
};

export default FiltersSection;
