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
import { IProcess, ITag } from 'runbotics-common';

import useDebounce from '#src-app/hooks/useDebounce';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';

import { Form } from '../utils/FormDialog.styles';
import { EditProcessDialogSelectFields, EditProcessDialogTextFields } from './EditProcessDialogForm';

const DEBOUNCE_TIME = 300;

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
    const [formState, setFormState] = useState<IProcess>();
    const [searchedTags, setSearchedTags] = useState<ITag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');
    const debouncedSearch = useDebounce<string>(search.trim(), DEBOUNCE_TIME);

    const handleTagSelect = (updatedTags: string[]) => {
        const lastTagInSearch = searchedTags.find(tag => tag.name === updatedTags.at(-1));

        setSelectedTags(updatedTags);
        if (updatedTags.length > selectedTags.length) {
            setFormState((prevState) => ({
                ...prevState,
                tags: [
                    ...formState.tags,
                    lastTagInSearch ?? { name: updatedTags.at(-1) }
                ]
            }));
        } else {
            setFormState((prevState) => ({
                ...prevState,
                tags: [...formState.tags].filter((tag) => updatedTags.includes(tag.name))
            }));
        }

        setSearch('');
    };

    const handleTagSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const filteredSearch = e.target.value.replaceAll(/[^A-Za-z0-9]/g, '');
        if (filteredSearch.length <= 20) setSearch(filteredSearch);
    };

    const handleAddByEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'
            && search !== ''
            && selectedTags.length < 15
            && !selectedTags.includes(search)
        ) handleTagSelect(selectedTags.concat(search));
    };

    const refreshList = (searchedValue: string) => {
        if(searchedValue !== '') {
            dispatch(processActions.getTagsByName(
                { filter: { contains: { 'name': debouncedSearch } } }
            ))
                .then(unwrapResult)
                .then((tags) => {
                    setSearchedTags(tags);
                });
        }
    };

    useEffect(() => {
        refreshList(debouncedSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const checkFormFieldsValidation = () => formValidationState.name;

    const getSearchedTagNames = () => {
        const searchedTagNames = searchedTags.map((tag) => tag.name);
        return (
            !searchedTagNames.includes(search) && search !== ''
                ? searchedTagNames.concat(search)
                : searchedTagNames
        );
    };

    const handleSubmit = () => {
        onAdd(getProcessDataWithoutEmptyStrings(formState));
    };

    useEffect(() => {
        setFormState(getProcessDataWithoutNulls(process));
        setSelectedTags(process.tags.map((tag) => tag.name));
    }, [process]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{translate('Process.Edit.Title')}</DialogTitle>
            <DialogContent>
                <Form>
                    <EditProcessDialogTextFields
                        formState={formState}
                        setFormState={setFormState}
                        formValidationState={formValidationState}
                        setFormValidationState={setFormValidationState}
                    />
                    <Autocomplete
                        fullWidth
                        value={selectedTags}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label='Tags'
                                onChange={handleTagSearch}
                                onKeyDown={handleAddByEnter}
                                placeholder={
                                    selectedTags.length
                                        ? ''
                                        : translate('Process.Edit.Form.Fields.Placeholder.TagSearch')
                                }
                            />
                        )}
                        options={getSearchedTagNames()}
                        onChange={(_, value) => handleTagSelect(value)}
                        getOptionDisabled={() => !(selectedTags.length < 15)}
                        filterOptions={(options) => options}
                        noOptionsText={translate('Process.Edit.Form.Fields.SearchTag.TagNotFound')}
                        disableCloseOnSelect
                        multiple
                    />
                    <EditProcessDialogSelectFields
                        formState={formState}
                        setFormState={setFormState}
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
