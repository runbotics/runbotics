import React, { useState } from 'react';

import { Grid, TextField, FormControl, InputLabel, Select, SelectChangeEvent, Typography, MenuItem, Box} from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import CredentialOptions from './CredentialOptions';

const GeneralInfo = () => {
    const { translate } = useTranslations();
    const [credentialsCollection, setCredentialsCollection] = useState('collection');
    const collections = [
        { name: 'Kolekcja Basi', id: 'kolekcja_basi' },
        { name: 'Kolekcja Ady', id: 'kolekcja_ady' },
        { name: 'Kolekcja Stasia', id: 'kolekcja_stasia' },
        { name: 'Kolekcja Asi', id: 'kolekcja_asi' }
    ];

    const handleChange = (event: SelectChangeEvent) => {
        setCredentialsCollection(event.target.value);
    };

    const collectionsToChoose = collections.map(collection => (
        <MenuItem key={collection.id} value={collection.name}>
            <Typography>{collection.name}</Typography>
        </MenuItem>
    ));

    return (
        <Box sx={{display: 'flex', width: '80%',  justifyContent: 'flexStart', marginBottom: '80px'}}>
            <Grid container spacing={5}>
                <Grid item xs={12} sx={{marginBottom: '-16px'}}>
                    <Typography variant="h5">{translate('Credential.GeneralInfo.Title')}</Typography>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label={translate('Credential.Details.Name.Label')} required></TextField>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth required>
                        <InputLabel id="collection_color">{translate('Credentials.Tab.Collections')}</InputLabel>
                        <Select
                            SelectDisplayProps={{ style: { display: 'flex' } }}
                            labelId="collection-label"
                            id="collection-select"
                            value={credentialsCollection}
                            label="Collection"
                            onChange={handleChange}
                        >
                            {collectionsToChoose}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label={translate('Credential.Details.Description.Label')} multiline></TextField>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" style={{ display: 'inline' }}>
                        {translate('Credential.Details.Dislaimer.Label')}
                    </Typography>
                    <Typography variant="body2" style={{ display: 'inline' }}>
                        {translate('Credential.Details.Dislaimer.Text')}
                    </Typography>
                </Grid>
                <CredentialOptions/>
            </Grid>
        </Box>
    );
};

export default GeneralInfo;
