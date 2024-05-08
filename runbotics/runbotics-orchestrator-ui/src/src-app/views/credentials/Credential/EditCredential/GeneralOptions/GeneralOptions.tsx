import { FC } from 'react';

import { Box, TextField } from '@mui/material';

import Accordion from '#src-app/components/Accordion';

import useTranslations from '#src-app/hooks/useTranslations';

import { CredentalGeneralOptionsProps } from './GeneralOptions.types';
import { inputErrorMessages } from '../EditCredential.utils';

export const GeneralOptions: FC<CredentalGeneralOptionsProps> = ({credentialData, formValidationState, inputErrorType}) => {
    const { translate } = useTranslations();

    const handleInputChange = () => {};

    return (
        <Accordion title={translate('Credential.Form.Fields.General.Label')} defaultExpanded>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    fullWidth
                    name="name"
                    label={translate('Credential.Form.Fields.Name.Label')}
                    onChange={handleInputChange}
                    value={credentialData.name}
                    variant="outlined"
                    error={!formValidationState}
                    {...(!formValidationState && { helperText: translate('Credential.Add.Form.Error.NameIsRequired') })}
                    InputLabelProps={{ shrink: true }}
                    required
                    helperText={inputErrorMessages[inputErrorType]}
                />
                <TextField
                    fullWidth
                    label={translate('Process.Edit.Form.Fields.Description.Label')}
                    name="description"
                    onChange={handleInputChange}
                    value={credentialData.description ?? ''}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                />
                {/* <TagsInput
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
                /> */}
            </Box>
        </Accordion>
    );
};
