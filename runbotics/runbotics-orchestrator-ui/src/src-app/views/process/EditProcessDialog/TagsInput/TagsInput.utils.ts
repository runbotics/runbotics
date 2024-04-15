import { ChangeEvent } from 'react';

export const handleSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setSearch: (newSearch: string) => void, maxTagsAmount) => {
    const filteredSearch = e.target.value.replaceAll(/[^A-Za-z0-9]/g, '');
    if (filteredSearch.length <= maxTagsAmount) setSearch(filteredSearch);
};
