import { useEffect, VFC } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { FilterQueryParamsEnum, getPageUrl } from '#contentful/common';

import SearchBar from '#src-landing/components/SearchBar';

import styles from './SearchBarSection.module.scss';

interface Props {
}

const SearchBarSection: VFC<Props> = ({}) => {
    const { query, push } = useRouter();
    const searchParams = useSearchParams();

    const stringSearch = Array.isArray(query?.search)
        ? query.search[0]
        : query.search;

    const pushFilters = (search?: string) => {
        const newSearchParam = new URLSearchParams();

        if (searchParams.has('industry')) {
            searchParams.getAll('industry').forEach(searchParam => {
                newSearchParam.append(FilterQueryParamsEnum.Industry, searchParam);
            });
        }

        if (search) {
            newSearchParam.append(FilterQueryParamsEnum.Search, search);
        }

        const newUrl = getPageUrl('marketplace', newSearchParam);

        push(newUrl);
    };

    useEffect(() => {
        pushFilters(stringSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        stringSearch,
    ]);

    return (
        <div className={`${styles.root}`}>
            <SearchBar onClick={pushFilters} />
        </div>
    );
};

export default SearchBarSection;
