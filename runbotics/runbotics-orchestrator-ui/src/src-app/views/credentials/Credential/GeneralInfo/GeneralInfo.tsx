import React, { FC } from 'react';

import { Grid, Typography, Box } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';



import { ColorDot } from '../../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.styled';
import { collectionColors, ColorNames } from '../../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';
import { BasicCredentialDto } from '../Credential.types';

interface GeneralInfoProps {
    credential: BasicCredentialDto;
    collectionColor: ColorNames;
}

const GeneralInfo: FC<GeneralInfoProps> = ({ credential, collectionColor }) => {
    const templateId = credential.templateId;
    const { translate } = useTranslations();
    const templates = useSelector(state => state.credentialTemplates.data);
    const credentialTemplate = templates.find(template => template.id === templateId);
    console.log(collectionColor);
    const color = collectionColors[collectionColor].hex;

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
                            <ColorDot collectionColor={color} />
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
                            {credentialTemplate ? credentialTemplate.name : credential.templateId}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GeneralInfo;
