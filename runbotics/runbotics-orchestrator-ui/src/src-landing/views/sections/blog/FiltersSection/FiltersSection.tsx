import { VFC, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    FilterQueryParamsEnum,
    Category,
    Tag,
    getPageUrl,
} from '#contentful/common';
import MinusIcon from '#public/images/icons/minus.svg';
import PlusIcon from '#public/images/icons/plus.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import Checkbox from '#src-landing/components/Checkbox';
import DateRange, { IDateRange } from '#src-landing/components/DateRange';
import SearchInput from '#src-landing/components/SearchInput';
import Typography from '#src-landing/components/Typography';

import styles from './FiltersSection.module.scss';

interface Props {
    isFilterDisplayed: Boolean;
    handleFilterDisplayed: Function;
    categories: Category[];
    tags: Tag[];
}

// eslint-disable-next-line max-lines-per-function
const FiltersSection: VFC<Props> = ({
    isFilterDisplayed,
    handleFilterDisplayed,
    categories,
    tags,
}) => {
    const { translate } = useTranslations();
    const { query, push } = useRouter();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isCategoriesSectionExpanded, setCategoriesSectionExpand] =
        useState(false);
    const [isTagsSectionExpanded, setTagsSectionExpand] = useState(false);
    const [dateRange, setDateRange] = useState<Partial<IDateRange>>();

    const searchParam = Array.isArray(query?.search)
        ? query.search[0]
        : query.search;

    useEffect(() => {
        if (query.category) {
            setSelectedCategories(
                Array.isArray(query.category)
                    ? query.category
                    : [query.category]
            );
        } else {
            setSelectedCategories([]);
        }

        if (query.tag) {
            setSelectedTags(Array.isArray(query.tag) ? query.tag : [query.tag]);
        } else {
            setSelectedTags([]);
        }

        const initialDateRange: Partial<IDateRange> = {};
        if (query.startDate && typeof query.startDate === 'string') {
            initialDateRange.startDate = query.startDate;
        }

        if (query.endDate && typeof query.endDate === 'string') {
            initialDateRange.endDate = query.endDate;
        }
        setDateRange(initialDateRange);
    }, [query]);

    const handleCategoryCheckboxChange = (slug: string) => {
        if (selectedCategories.includes(slug)) {
            setSelectedCategories((prevState) =>
                prevState.filter((category) => category !== slug)
            );
        } else {
            setSelectedCategories((prevState) => [...prevState, slug]);
        }
    };

    const handleTagCheckboxChange = (slug: string) => {
        if (selectedTags.includes(slug)) {
            setSelectedTags((prevState) =>
                prevState.filter((tag) => tag !== slug)
            );
        } else {
            setSelectedTags((prevState) => [...prevState, slug]);
        }
    };

    const pushFilters = (search?: string) => {
        const searchParams = new URLSearchParams();

        selectedCategories.forEach((category) =>
            searchParams.append(FilterQueryParamsEnum.Category, category)
        );
        selectedTags.forEach((tag) =>
            searchParams.append(FilterQueryParamsEnum.Tag, tag)
        );
        if (dateRange?.startDate) {
            searchParams.append(
                FilterQueryParamsEnum.StartDate,
                dateRange.startDate
            );
        }
        if (dateRange?.endDate) {
            searchParams.append(
                FilterQueryParamsEnum.EndDate,
                dateRange.endDate
            );
        }
        if (search) {
            searchParams.append(FilterQueryParamsEnum.Search, search);
        }

        const newUrl = getPageUrl('blog', searchParams);

        push(newUrl);
    };

    useEffect(() => {
        pushFilters(searchParam);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        searchParam,
        selectedCategories.length,
        selectedTags.length,
        dateRange?.endDate,
        dateRange?.startDate,
    ]);

    const categoriesCheckboxes = categories
        ?.filter(category => category.title && category.slug)
        .map((category, index) => (
            <Checkbox
                key={category.slug}
                className={
                    index < 5 || isCategoriesSectionExpanded ? '' : styles.hidden
                }
                checked={selectedCategories.includes(category.slug)}
                onChange={() => handleCategoryCheckboxChange(category.slug)}
                label={category.title}
                title={category.title}
                size="regular"
                singleLine
            />
        ));

    const tagsCheckboxes = tags
        ?.filter(tag => tag.name && tag.slug)
        .map((tag, index) => (
            <Checkbox
                key={tag.slug}
                className={index < 5 || isTagsSectionExpanded ? '' : styles.hidden}
                checked={selectedTags.includes(tag.slug)}
                onChange={() => handleTagCheckboxChange(tag.slug)}
                label={tag.name}
                title={tag.name}
                size="regular"
                singleLine
            />
        ));

    return (
        <aside
            className={`${styles.root} ${
                isFilterDisplayed ? '' : styles.hideFilters
            }`}
        >
            <div className={styles.wrapper}>
                <button onClick={() => handleFilterDisplayed(false)} className={styles.exitBtn}>
                    <span />
                    <span />
                </button>
                <SearchInput
                    className={styles.searchForm}
                    initialValue={searchParam}
                    onClick={pushFilters}
                />
            </div>
            <div className={styles.filtersHeader}>
                <Typography variant="h4">
                    {translate('Blog.Filters.Title')}
                </Typography>
                <Link
                    onClick={() => handleFilterDisplayed(false)}
                    className={styles.clearLink}
                    href={'/blog'}
                >
                    {translate('Blog.Filters.ClearAll')}
                </Link>
            </div>
            <div className={styles.filterSectionWrapper} data-type="category">
                <Typography variant="h6">
                    {translate('Blog.Filters.Category')}
                </Typography>
                <div className={styles.categoriesSectionWrapper}>
                    {categoriesCheckboxes}
                </div>
                <button
                    className={styles.expandSectionButton}
                    type="button"
                    data-hide={categories?.length <= 5}
                    onClick={() => {
                        setCategoriesSectionExpand((prevState) => !prevState);
                    }}
                >
                    <Image
                        src={isCategoriesSectionExpanded ? MinusIcon : PlusIcon}
                        alt={isCategoriesSectionExpanded ? 'minus' : 'plus'}
                        width={14}
                        height={14}
                    />
                    <Typography variant="body4" element="span" color="accent">
                        {isCategoriesSectionExpanded
                            ? translate('Blog.Filters.Less')
                            : translate('Blog.Filters.More')}
                    </Typography>
                </button>
            </div>
            <div className={styles.filterSectionWrapper} data-type="tag">
                <Typography variant="h6">
                    {translate('Blog.Filters.Tag')}
                </Typography>
                <div className={styles.categoriesSectionWrapper}>
                    {tagsCheckboxes}
                </div>
                <button
                    className={styles.expandSectionButton}
                    type="button"
                    data-hide={tags?.length <= 5}
                    onClick={() => {
                        setTagsSectionExpand((prevState) => !prevState);
                    }}
                >
                    <Image
                        src={isTagsSectionExpanded ? MinusIcon : PlusIcon}
                        alt={isTagsSectionExpanded ? 'minus' : 'plus'}
                        width={14}
                        height={14}
                    />
                    <Typography variant="body4" element="span" color="accent">
                        {isTagsSectionExpanded
                            ? translate('Blog.Filters.Less')
                            : translate('Blog.Filters.More')}
                    </Typography>
                </button>
            </div>
            <div className={styles.filterSectionWrapper} data-type="date">
                <Typography variant="h6">
                    {translate('Blog.Filters.Date')}
                </Typography>
                <DateRange
                    initialDateRange={dateRange}
                    onChange={setDateRange}
                />
            </div>
            <button
                className={styles.applyFilter}
                onClick={() => handleFilterDisplayed(false)}
            >
                <Typography variant="h6">
                    {translate('Blog.Filters.ApplyFilters')}
                </Typography>
            </button>
        </aside>
    );
};

export default FiltersSection;
