import { FC } from 'react';

import { Grid, Typography, Box } from '@mui/material';

import { ColorNames, FrontCredentialDto } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';

import { useSelector } from '#src-app/store';

import { credentialTemplatesSelector } from '#src-app/store/slices/CredentialTemplates';

import { ColorDot } from '../../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.styles';

interface GeneralInfoProps {
    credential: FrontCredentialDto;
    collectionColor: ColorNames;
    collectionName: string;
}

const GeneralInfo: FC<GeneralInfoProps> = ({ credential, collectionColor, collectionName }) => {
    const templateId = credential.templateId;
    const { translate } = useTranslations();
    const { credentialTemplates } = useSelector(credentialTemplatesSelector);
    const credentialTemplate = credentialTemplates && credentialTemplates.find(template => template.id === templateId);

    return (
        <Box sx={{ display: 'flex', width: '90%', justifyContent: 'flexStart', marginBottom: '48px' }}>
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
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }} ml={1}>
                            <ColorDot collectionColor={collectionColor} />
                            {collectionName}
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
                            {credentialTemplate && credentialTemplate.name}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default GeneralInfo;
