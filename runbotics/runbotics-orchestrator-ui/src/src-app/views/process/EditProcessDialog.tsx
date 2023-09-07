import React, { ChangeEvent, FC, useState, useEffect, KeyboardEvent } from 'react';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,

    Autocomplete,
} from '@mui/material';

import { unwrapResult } from '@reduxjs/toolkit';
import { IProcess, Tag } from 'runbotics-common';

import useDebounce from '#src-app/hooks/useDebounce';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

import { EditProcessDialogSelectFields, EditProcessDialogTextFields } from './EditProcessDialogForm';
import { Form } from '../utils/FormDialog.styles';

const DEBOUNCE_TIME = 300;
const MAX_NUMBER_OF_TAGS = 15;
const MAX_TAG_LENGTH = 20;

type EditProcessDialogProps = {
    open?: boolean;
    process: IProcess;
    onClose: () => void;
    onAdd: (process: IProcess) => void;
};

export interface FormValidationState {
    name: boolean;
}

const initialFormValidationState: FormValidationState = {
    name: true
};

const getProcessDataWithoutNulls = (process: IProcess): IProcess => ({
    ...process,
    description: process.description ?? ''
});

const getProcessDataWithoutEmptyStrings = (process: IProcess): IProcess => ({
    ...process,
    description: (process.description === '' ? null : process.description)
});

const EditProcessDialog: FC<EditProcessDialogProps> = ({
    process, onAdd, onClose, open,
}) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();

    const [formValidationState, setFormValidationState] = useState<FormValidationState>(initialFormValidationState);
    const [processFormState, setProcessFormState] = useState<IProcess>();
    const [searchedDatabaseTags, setSearchedDatabaseTags] = useState<Tag[]>([]);
    const [selectedTagsNames, setSelectedTagsNames] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');
    const debouncedSearch = useDebounce<string>(search.trim(), DEBOUNCE_TIME);

    const handleTagChange = (updatedTags: string[]) => {
        setSelectedTagsNames(updatedTags);

        const hasTagBeenAdded = updatedTags.length > selectedTagsNames.length;
        if (hasTagBeenAdded) {
            const tagToAdd = (searchedDatabaseTags.find(tag => tag.name === updatedTags.at(-1))) ?? { name: updatedTags.at(-1) };
            setProcessFormState((prevState) => ({
                ...prevState,
                tags: [...processFormState.tags, tagToAdd]
            }));
        } else {
            const filteredTags = [...processFormState.tags].filter((tag) => updatedTags.includes(tag.name));
            setProcessFormState((prevState) => ({
                ...prevState,
                tags: filteredTags
            }));
        }

        setSearch('');
    };

    const handleTagSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const filteredSearch = e.target.value.replaceAll(/[^A-Za-z0-9]/g, '');
        if (filteredSearch.length <= MAX_TAG_LENGTH) setSearch(filteredSearch);
    };

    const handleAddByEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'
            && search !== ''
            && selectedTagsNames.length < MAX_NUMBER_OF_TAGS
            && !selectedTagsNames.includes(search)
        ) handleTagChange(selectedTagsNames.concat(search));
    };

    const refreshTagList = (searchedValue: string) => {
        if(searchedValue === '') return;

        dispatch(processActions.getTagsByName(
            { filter: { contains: { 'name': debouncedSearch } } }
        ))
            .then(unwrapResult)
            .then((tags) => {
                setSearchedDatabaseTags(tags);
            });
    };

    useEffect(() => {
        refreshTagList(debouncedSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const checkFormFieldsValidation = () => formValidationState.name;

    const getSearchedTagNames = () => {
        const searchedTagNames = searchedDatabaseTags.map((tag) => tag.name);
        return (
            !searchedTagNames.includes(search) && search !== ''
                ? searchedTagNames.concat(search)
                : searchedTagNames
        );
    };

    const handleSubmit = () => {
        onAdd(getProcessDataWithoutEmptyStrings(processFormState));
    };

    useEffect(() => {
        setProcessFormState(getProcessDataWithoutNulls(process));
        setSelectedTagsNames(process.tags.map((tag) => tag.name));
    }, [process]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{translate('Process.Edit.Title')}</DialogTitle>
            <DialogContent>
                <Form>
                    <EditProcessDialogTextFields
                        processFormState={processFormState}
                        setProcessFormState={setProcessFormState}
                        formValidationState={formValidationState}
                        setFormValidationState={setFormValidationState}
                    />
                    <Autocomplete
                        fullWidth
                        value={selectedTagsNames}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label='Tags'
                                onChange={handleTagSearch}
                                onKeyDown={handleAddByEnter}
                                placeholder={
                                    selectedTagsNames.length
                                        ? ''
                                        : translate('Process.Edit.Form.Fields.Placeholder.TagSearch')
                                }
                            />
                        )}
                        options={getSearchedTagNames()}
                        onChange={(_, value) => handleTagChange(value)}
                        getOptionDisabled={() => !(selectedTagsNames.length < MAX_NUMBER_OF_TAGS)}
                        filterOptions={(options) => options}
                        noOptionsText={translate('Process.Edit.Form.Fields.SearchTag.TagNotFound')}
                        disableCloseOnSelect
                        multiple
                    />
                    <EditProcessDialogSelectFields
                        processFormState={processFormState}
                        setProcessFormState={setProcessFormState}
                    />
                </Form>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>
                    {translate('Common.Cancel')}
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    autoFocus
                    onClick={handleSubmit}
                    disabled={!checkFormFieldsValidation()}
                >
                    {translate('Common.Save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProcessDialog;
