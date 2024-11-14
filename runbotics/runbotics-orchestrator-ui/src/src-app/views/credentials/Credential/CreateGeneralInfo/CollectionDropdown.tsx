import { FC } from 'react';

import { Grid, MenuItem, SelectChangeEvent, Typography } from '@mui/material';

import { FrontCredentialCollectionDto } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';

import GeneralInfoDropdown from './CreateGeneralInfoDropdown';

interface CollectionDropdownProps {
    disabled: boolean;
    credentialCollections: FrontCredentialCollectionDto[];
    selectedValue: string | undefined;
    handleChange: (event: SelectChangeEvent) => void;
    error: boolean;
    helperText: string
}

export const CollectionDropdown: FC<CollectionDropdownProps> = ({ disabled, credentialCollections, selectedValue, handleChange, error, helperText }) => {
    const { translate } = useTranslations();

    const collectionsToChoose = credentialCollections
        ? credentialCollections.map(collection => (
            <MenuItem key={collection.id} value={collection.id}>
                <Typography>{collection.name}</Typography>
            </MenuItem>
        ))
        : null;

    return (
        <Grid item xs={12} mt={2}>
            <GeneralInfoDropdown
                disabled={disabled}
                selectLabel={translate('Credentials.Tab.Collections')}
                tooltipText={translate('Credential.Details.Disclaimer.Text')}
                selectOptions={collectionsToChoose}
                selectedValue={selectedValue}
                handleChange={handleChange}
                required
                error={error}
                helperText={helperText}
            />
        </Grid>
    );
};
