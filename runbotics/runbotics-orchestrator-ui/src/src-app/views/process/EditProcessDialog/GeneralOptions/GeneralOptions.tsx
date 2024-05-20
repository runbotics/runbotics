import React, { FC, useEffect, useState } from 'react';

import {
    Box,
    TextField
} from '@mui/material';
import { Tag } from 'runbotics-common';

import Accordion from '#src-app/components/Accordion';
import useTranslations from '#src-app/hooks/useTranslations';

import { GeneralOptionsProps } from './GeneralOptions.types';
import { inputErrorMessages, MAX_NUMBER_OF_TAGS } from '../EditProcessDialog.utils';
import TagsInput from '../TagsInput';


export const GeneralOptions: FC<GeneralOptionsProps> = ({
    processData,
    setProcessData,
    formValidationState,
    setFormValidationState,
    inputErrorType,
    formState,
    setFormState,
    isOwner
}) => {
    const { translate } = useTranslations();

    const [autocompleteTagList, setAutocompleteTagList] = useState<Tag[]>([]);
    const [selectedTagsNames, setSelectedTagsNames] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');

    useEffect(() => {
        setSelectedTagsNames(processData.tags.map((tag) => tag.name));
    }, [processData.tags]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setProcessData((prevState) => ({ ...prevState, [name]: value }));

        if (name !== 'name') return;

        setFormValidationState((prevState) => ({ ...prevState, name: (value.trim() !== '') }));
    };

    return (
        <Accordion title={translate('Process.Edit.Form.Fields.General.Label')} defaultExpanded>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    fullWidth
                    name="name"
                    label={translate('Process.Edit.Form.Fields.Name.Label')}
                    onChange={handleInputChange}
                    value={processData.name}
                    variant="outlined"
                    error={!formValidationState.name}
                    {...(!formValidationState.name && { helperText: translate('Process.Edit.Form.Fields.Error.Required') })}
                    InputLabelProps={{ shrink: true }}
                    required
                    helperText={inputErrorMessages[inputErrorType]}
                />
                <TextField
                    fullWidth
                    label={translate('Process.Edit.Form.Fields.Description.Label')}
                    name="description"
                    onChange={handleInputChange}
                    value={processData.description ?? ''}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                />
                <TagsInput
                    selected={selectedTagsNames}
                    setSelected={setSelectedTagsNames}
                    formState={formState}
                    setFormState={setFormState}
                    search={search}
                    setSearch={setSearch}
                    autocompleteList={autocompleteTagList}
                    setAutocompleteList={setAutocompleteTagList}
                    maxAmount={MAX_NUMBER_OF_TAGS}
                    isOwner={isOwner}
                />
            </Box>
        </Accordion>
    );
};

