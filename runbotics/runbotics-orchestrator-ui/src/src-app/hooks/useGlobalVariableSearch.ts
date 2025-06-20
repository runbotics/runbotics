import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { useDispatch } from 'react-redux';

import { globalVariableActions } from '#src-app/store/slices/GlobalVariable';

import useDebounce from './useDebounce';
import { useReplaceQueryParams } from './useReplaceQueryParams';

const DEBOUNCE_TIME = 400;

const useGlobalVariableSearch = ( pageSize = 10, page = 0 ) => {
    const searchParams = useSearchParams();
    const searchFormUrl = searchParams.get('search');
    const [search, setSearch] = useState(searchFormUrl || '');
    const replaceQueryParams = useReplaceQueryParams();

    const dispatch = useDispatch();
    const debouncedValue = useDebounce<string>(search, DEBOUNCE_TIME);
    
    useEffect(() => {
        replaceQueryParams({
            page,
            pageSize,
            search
        });

        if(debouncedValue.trim() !== '') {
            dispatch(
                globalVariableActions.getGlobalVariables({
                    pageParams: {
                        page,
                        size: pageSize,
                        filter: {
                            contains: {
                                ...(search.trim() && { name: search.trim() })
                            }
                        }
                    }
                })
            );
        } else {
            dispatch(
                globalVariableActions.getGlobalVariables({
                    pageParams: {
                        page,
                        size: pageSize,
                        filter: {
                            contains: {
                                ...(debouncedValue.trim() && { name: debouncedValue.trim() })
                            }
                        }
                    }
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedValue, pageSize, page]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const clearSearch = () => {
        setSearch('');
    };

    return {
        handleSearch,
        search,
        clearSearch
    };

};

export default useGlobalVariableSearch;
