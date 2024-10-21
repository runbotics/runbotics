
import React, { FC, KeyboardEvent, useEffect } from 'react';

import { Autocomplete, TextField } from '@mui/material';

import { unwrapResult } from '@reduxjs/toolkit';

import useDebounce from '#src-app/hooks/useDebounce';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

import { TagsInputProps } from './TagsInput.types';
import { handleSearch } from './TagsInput.utils';
import { DEBOUNCE_TIME } from '../EditProcessDialog.utils';

const TagsInput: FC<TagsInputProps> = ({
    selected,
    setSelected,
    formState,
    setFormState,
    search,
    setSearch,
    autocompleteList,
    setAutocompleteList,
    isOwner,
    maxAmount
}) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const debouncedSearch = useDebounce<string>(search.trim(), DEBOUNCE_TIME);

    const handleChange = (updatedTags: string[]) => {
        setSelected(updatedTags);

        const hasTagBeenAdded = updatedTags.length > selected.length;
        if (hasTagBeenAdded) {
            const tagToAdd = (autocompleteList.find(tag => tag.name === updatedTags.at(-1))) ?? { name: updatedTags.at(-1) };
            setFormState((prevState) => ({
                ...prevState,
                tags: [...formState.tags, tagToAdd]
            }));
        } else {
            const filteredTags = [...formState.tags].filter((tag) => updatedTags.includes(tag.name));
            setFormState((prevState) => ({
                ...prevState,
                tags: filteredTags
            }));
        }

        setSearch('');
    };

    const getSearched = () => {
        const searchedTagNames = autocompleteList.map((tag) => tag.name);
        return (
            search !== '' && !searchedTagNames.includes(search)
                ? searchedTagNames.concat(search)
                : searchedTagNames
        );
    };

    const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        const shouldAddTag = (
            e.key === 'Enter'
            && search !== ''
            && selected.length < maxAmount
            && !selected.includes(search)
        );

        if (shouldAddTag) handleChange(selected.concat(search));
    };

    const refreshTagList = (searchedValue: string) => {
        if (searchedValue === '') return;

        dispatch(processActions.getTagsByName({
            pageParams: { filter: { contains: { name: debouncedSearch } } } }
        ))
            .then(unwrapResult)
            .then(tags => {
                setAutocompleteList(tags);
            });
    };

    useEffect(() => {
        refreshTagList(debouncedSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    return (
        <Autocomplete
            fullWidth
            value={selected}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label='Tags'
                    onChange={(e) => handleSearch(e, setSearch, maxAmount)}
                    onKeyDown={handleEnter}
                    placeholder={
                        selected.length
                            ? ''
                            : translate('Process.Edit.Form.Fields.Placeholder.TagSearch')
                    }
                />
            )}
            options={getSearched()}
            onChange={(_, value) => handleChange(value)}
            getOptionDisabled={() => !(selected.length < maxAmount)}
            filterOptions={(options) => options}
            noOptionsText={translate('Process.Edit.Form.Fields.SearchTag.TagNotFound')}
            disabled={!isOwner}
            disableCloseOnSelect
            multiple
        />
    );
};

export default TagsInput;
