import { FC, useState } from 'react';

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

const FiltersSection: FC<Props> = ({
    isFilterDisplayed,
    handleFilterDisplayed,
    categories,
    tags,
}) => {
    const { translate } = useTranslations();
    const { query, push } = useRouter();

    const [isCategoriesSectionExpanded, setCategoriesSectionExpand] =
        useState(false);
    const [isTagsSectionExpanded, setTagsSectionExpand] = useState(false);
    
    const searchParam = Array.isArray(query?.search)
        ? query.search[0]
        : query.search || '';

    // eslint-disable-next-line no-nested-ternary
    const selectedCategories = Array.isArray(query.category)
        ? query.category
        : query.category
            ? [query.category]
            : [];

    // eslint-disable-next-line no-nested-ternary
    const selectedTags = Array.isArray(query.tag)
        ? query.tag
        : query.tag
            ? [query.tag]
            : [];

    const dateRange: Partial<IDateRange> = {
        startDate:
            typeof query.startDate === 'string' ? query.startDate : undefined,
        endDate: typeof query.endDate === 'string' ? query.endDate : undefined,
    };

    const buildUrl = (opts: {
        categories?: string[];
        tags?: string[];
        search?: string;
        range?: Partial<IDateRange>;
    }) => {
        const searchParams = new URLSearchParams();

        (opts.categories || []).forEach((c) =>
            searchParams.append(FilterQueryParamsEnum.Category, c),
        );
        (opts.tags || []).forEach((t) =>
            searchParams.append(FilterQueryParamsEnum.Tag, t),
        );

        if (opts.range?.startDate) {
            searchParams.append(FilterQueryParamsEnum.StartDate, opts.range.startDate);
        }
        if (opts.range?.endDate) {
            searchParams.append(FilterQueryParamsEnum.EndDate, opts.range.endDate);
        }
        if (opts.search) {
            searchParams.append(FilterQueryParamsEnum.Search, opts.search);
        }

        return getPageUrl('blog', searchParams);
    };

    const toggleCategory = (slug: string) => {
        const newSelected = selectedCategories.includes(slug)
            ? selectedCategories.filter((c) => c !== slug)
            : [...selectedCategories, slug];

        push(buildUrl({ categories: newSelected, tags: selectedTags, search: searchParam, range: dateRange }));
    };

    const toggleTag = (slug: string) => {
        const newSelected = selectedTags.includes(slug)
            ? selectedTags.filter((t) => t !== slug)
            : [...selectedTags, slug];

        push(buildUrl({ categories: selectedCategories, tags: newSelected, search: searchParam, range: dateRange }));
    };

    const handleDateChange = (range: Partial<IDateRange>) => {
        push(buildUrl({ categories: selectedCategories, tags: selectedTags, search: searchParam, range }));
    };

    const handleSearch = (search?: string) => {
        push(buildUrl({ categories: selectedCategories, tags: selectedTags, search, range: dateRange }));
    };

    const categoriesCheckboxes = categories
        ?.filter((category) => category.title && category.slug)
        .map((category, index) => (
            <Checkbox
                key={category.slug}
                className={index < 5 || isCategoriesSectionExpanded ? '' : styles.hidden}
                checked={selectedCategories.includes(category.slug)}
                onChange={() => toggleCategory(category.slug)}
                label={category.title}
                title={category.title}
                size="regular"
                singleLine
            />
        ));

    const tagsCheckboxes = tags
        ?.filter((tag) => tag.name && tag.slug)
        .map((tag, index) => (
            <Checkbox
                key={tag.slug}
                className={index < 5 || isTagsSectionExpanded ? '' : styles.hidden}
                checked={selectedTags.includes(tag.slug)}
                onChange={() => toggleTag(tag.slug)}
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
                <button
                    onClick={() => handleFilterDisplayed(false)}
                    className={styles.exitBtn}
                >
                    <span />
                    <span />
                </button>
                <SearchInput
                    className={styles.searchForm}
                    initialValue={searchParam}
                    onClick={handleSearch}
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
                    onClick={() => setCategoriesSectionExpand((prev) => !prev)}
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
                <div className={styles.categoriesSectionWrapper}>{tagsCheckboxes}</div>
                <button
                    className={styles.expandSectionButton}
                    type="button"
                    data-hide={tags?.length <= 5}
                    onClick={() => setTagsSectionExpand((prev) => !prev)}
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
                <Typography variant="h6">{translate('Blog.Filters.Date')}</Typography>
                <DateRange initialDateRange={dateRange} onChange={handleDateChange} />
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
