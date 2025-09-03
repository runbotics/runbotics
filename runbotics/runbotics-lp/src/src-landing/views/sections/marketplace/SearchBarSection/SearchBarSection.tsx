import { FC } from 'react';

import { useRouter } from 'next/router';

import { FilterQueryParamsEnum, getPageUrl } from '#contentful/common';
import SearchBar from '#src-landing/components/SearchBar';

import styles from './SearchBarSection.module.scss';

interface Props {}

const SearchBarSection: FC<Props> = ({}) => {
    const { query, push, asPath } = useRouter();

    const searchParam = Array.isArray(query?.search)
        ? query.search[0]
        : query.search || '';

    const handleSearch = (search?: string) => {
        const searchParams = new URLSearchParams();

        if (query.industry) {
            const industries = Array.isArray(query.industry)
                ? query.industry
                : [query.industry];

            industries.forEach((i) =>
                searchParams.append(FilterQueryParamsEnum.Industry, i),
            );
        }

        if (search) {
            searchParams.append(FilterQueryParamsEnum.Search, search);
        }

        const newUrl = getPageUrl('marketplace', searchParams);
        if(newUrl !== asPath) {
            push(newUrl);
        }
    };

    return (
        <div className={styles.root}>
            <SearchBar
                initialValue={searchParam} 
                onClick={handleSearch}
            />
        </div>
    );
};

export default SearchBarSection;
