import { FC, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import {
    FilterQueryParamsEnum,
    getPageUrl,
    Industry,
} from '#contentful/common';
import MinusIcon from '#public/images/icons/minus.svg';
import PlusIcon from '#public/images/icons/plus.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import Checkbox from '#src-landing/components/Checkbox';
import Typography from '#src-landing/components/Typography';

import styles from './FiltersSection.module.scss';

interface Props {
    isFilterDisplayed: Boolean;
    handleFilterDisplayed: Function;
    industries: Industry[];
}

const FiltersSection: FC<Props> = ({
    isFilterDisplayed,
    handleFilterDisplayed,
    industries,
}) => {
    const { translate } = useTranslations();
    const { query, push, asPath } = useRouter();
    const [isIndustriesSectionExpanded, setIsIndustriesSectionExpanded] =
        useState(false);

    const searchParam = Array.isArray(query?.search)
        ? query.search[0]
        : query.search;

    // eslint-disable-next-line no-nested-ternary
    const selectedIndustries = Array.isArray(query.industry)
        ? query.industry
        : query.industry
            ? [query.industry]
            : [];

    const handleIndustryCheckboxChange = (slug: string) => {
        const newSelected = selectedIndustries.includes(slug)
            ? selectedIndustries.filter((i) => i !== slug)
            : [...selectedIndustries, slug];

        const searchParams = new URLSearchParams();
        newSelected.forEach((industry) =>
            searchParams.append(FilterQueryParamsEnum.Industry, industry)
        );

        if (searchParam) {
            searchParams.append(FilterQueryParamsEnum.Search, searchParam);
        }

        const newUrl = getPageUrl('marketplace', searchParams);

        if (asPath !== newUrl) {
            push(newUrl);
        }
    };

    const industriesCheckboxes = industries
        ?.filter((industry) => industry.title && industry.slug)
        .map((industry, index) => (
            <Checkbox
                key={industry.slug}
                className={
                    index < 5 || isIndustriesSectionExpanded
                        ? ''
                        : styles.hidden
                }
                checked={selectedIndustries.includes(industry.slug)}
                onChange={() => handleIndustryCheckboxChange(industry.slug)}
                label={industry.title}
                title={industry.title}
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
            <div className={styles.backgroundWrapper}>
                <div className={styles.filtersHeader}>
                    <Typography variant="h4">
                        {translate('Marketplace.Filters.Title')}
                    </Typography>
                    <Link
                        onClick={() => handleFilterDisplayed(false)}
                        className={styles.clearLink}
                        href={'/marketplace'}
                    >
                        {translate('Marketplace.Filters.ClearAll')}
                    </Link>
                </div>
                <div
                    className={styles.filterSectionWrapper}
                    data-type="industry"
                >
                    <Typography variant="h6">
                        {translate('Marketplace.Filters.Industry')}
                    </Typography>
                    <div className={styles.categoriesSectionWrapper}>
                        {industriesCheckboxes}
                    </div>
                    <button
                        className={styles.expandSectionButton}
                        type="button"
                        data-hide={industries?.length <= 5}
                        onClick={() => {
                            setIsIndustriesSectionExpanded((prev) => !prev);
                        }}
                    >
                        <Image
                            src={
                                isIndustriesSectionExpanded
                                    ? MinusIcon
                                    : PlusIcon
                            }
                            alt={isIndustriesSectionExpanded ? 'minus' : 'plus'}
                            width={14}
                            height={14}
                        />
                        <Typography
                            variant="body4"
                            element="span"
                            color="accent"
                        >
                            {isIndustriesSectionExpanded
                                ? translate('Marketplace.Filters.Less')
                                : translate('Marketplace.Filters.More')}
                        </Typography>
                    </button>
                </div>
                <button
                    className={styles.applyFilter}
                    onClick={() => handleFilterDisplayed(false)}
                >
                    <Typography variant="h6">
                        {translate('Marketplace.Filters.ApplyFilters')}
                    </Typography>
                </button>
            </div>
        </aside>
    );
};

export default FiltersSection;
