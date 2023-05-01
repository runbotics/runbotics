import { ChangeEvent, VFC, useLayoutEffect, useState } from 'react';

import Image from 'next/image';

import { useRouter } from 'next/router';

import { Category, Tag } from '#contentful/models';
import { FilterQueryParamsEnum } from '#contentful/types';
import SearchIcon from '#public/images/icons/search-black.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import Checkbox from '#src-landing/components/Checkbox';
import DateRange, { IDateRange } from '#src-landing/components/DateRange';
import Typography from '#src-landing/components/Typography';

import styles from './FiltersSection.module.scss';

interface Props {
    categories: Category[];
    tags: Tag[];
}

const FiltersSection: VFC<Props> = ({ categories, tags }) => {
    const { translate } = useTranslations();
    const { query, push } = useRouter();
    const [search, setSearch] = useState<string>('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    // const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<Partial<IDateRange>>();

    useLayoutEffect(() => {
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

        const searchInitialValue = Array.isArray(query?.search)
            ? query.search[0]
            : query.search;

        setSearch(searchInitialValue ?? '');
    }, [query]);

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const handleCategoryCheckboxChange = (slug: string) => {
        if (selectedCategories.includes(slug)) {
            setSelectedCategories(prevState => prevState.filter(category => category !== slug));
        } else {
            setSelectedCategories(prevState => [...prevState, slug]);
        }
    };

    const handleFilterClick = () => {
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

    // const tagsCheckboxes = tags.map(({ name }) => (
    //     <Checkbox
    //         key={name}
    //         checked={selectedTags.includes(name)}
    //         // onChange={() => handleCategoryCheckboxChange(category.slug)}
    //         label={name}
    //         title={name}
    //         singleLine
    //     />
    // ));

    return (
        <div className={styles.root}>
            <div className={styles.search}>
                <Image
                    className={styles.icon}
                    src={SearchIcon}
                    alt="search"
                    width={24}
                    height={24}
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder={'Search'}
                    onChange={handleSearch}
                    value={search}
                />
            </div>
            <div>
                <Typography variant='body3'>
                    Filter by:
                </Typography>
            </div>
            <div className={styles.filterSectionWrapper}>
                <Typography variant='h6'>
                    Category
                </Typography>
                <div>
                    {categoriesCheckboxes}
                </div>
            </div>
            {/* <div className={styles.filterSectionWrapper}>
                <Typography variant='h6'>
                    Tag
                </Typography>
                <div>
                    {tagsCheckboxes}
                </div>
            </div> */}
            <div className={styles.filterSectionWrapper}>
                <Typography variant='h6'>
                    Date
                </Typography>
                <DateRange
                    initialDateRange={dateRange}
                    onChange={setDateRange}
                />
            </div>
            <button onClick={handleFilterClick}>
                Filter
            </button>
            <button onClick={() => { push('/blog'); }}>
                Clear
            </button>
        </div>

    );
};

export default FiltersSection;
