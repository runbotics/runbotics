import React, { FC } from 'react';

import { Grid, Typography, Box } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { ColorDot } from '../../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.styled';
import { BasicCredentialDto } from '../Credential.types';

interface GeneralInfoProps {
    credential: BasicCredentialDto;
}

const GeneralInfo: FC<GeneralInfoProps> = ({ credential }) => {
    const { translate } = useTranslations();

    return (
        <Box sx={{ display: 'flex', width: '90%', justifyContent: 'flexStart', marginBottom: '80px' }}>
            <Grid container spacing={5}>
                <Grid item xs={12} sx={{ marginBottom: '-16px' }}>
                    <Typography variant="h4">{translate('Credential.GeneralInfo.Title')}</Typography>
                </Grid>
                <Grid item md={12} lg={6}>
                    <Box>
                        <Typography variant="h5" mb={1}>
                            {translate('Credential.Details.Name.Label')}
                        </Typography>
                        <Typography variant="body2" ml={1}>
                            {credential.name}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item md={12} lg={6}>
                    <Box>
                        <Typography variant="h5" mb={1}>
                            {translate('Credential.Details.Collection.Label')}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignContent: 'center' }} ml={1}>
                            <ColorDot collectionColor={credential.collectionColor} />
                            {credential.collectionId}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item md={12} lg={6}>
                    <Box>
                        <Typography variant="h5" mb={1}>
                            {translate('Credential.Details.Description.Label')}
                        </Typography>
                        <Typography variant="body2" ml={1}>
                            {credential.description ? credential.description : ''}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item md={12} lg={6}>
                    <Box>
                        <Typography variant="h5" mb={1}>
                            {translate('Credential.Details.Template.Label')}
                        </Typography>
                        <Typography variant="body2" ml={1}>
                            {credential.template}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GeneralInfo;
