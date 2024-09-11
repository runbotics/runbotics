import { FC, useEffect } from 'react';

import { CircularProgress, Grid } from '@mui/material';

import { useDispatch, useSelector } from '#src-app/store';

import { credentialsActions } from '#src-app/store/slices/Credentials';
import { fetchAllTemplates } from '#src-app/store/slices/CredentialTemplates/CredentialTemplates.thunks';

import { BasicCredentialDto } from '../../Credential.types';
import { DisplayAttribute } from '../CredentialAttribute/Attribute.types';

import TemplateAttribute from '../CredentialAttribute/TemplateAttribute/TemplateAttribute';


interface CredentialAttributesListProps {
    credential: BasicCredentialDto;
    templateId: string;
    isNewCredential: boolean;
}

const CredentialAttributesList: FC<CredentialAttributesListProps> = ({ credential, templateId, isNewCredential }) => {
    const dispatch = useDispatch();
    const templates = useSelector(state => state.credentialTemplates.data);
    const credentialTemplate = templates.find(template => template.id === templateId);
    const templatesLoading = useSelector(state => state.credentialTemplates.loading);

    useEffect(() => {
        dispatch(credentialsActions.fetchOneCredential({resourceId: credential.id}));
    }, []);

    useEffect(() => {
        if (templates.length === 0) {
            dispatch(fetchAllTemplates());
        }
    }, [dispatch, templates]);

    if (templatesLoading || templates.length === 0) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
                <CircularProgress />
            </Grid>
        );
    }

    const templateAttributesCards = credentialTemplate.attributes.map((attribute, index) => (
        <Grid item key={attribute.id} xl={3} lg={4} md={6} xs={12} height="100%" display="flex">
            <TemplateAttribute credentialId={credential.id} attribute={attribute as DisplayAttribute} isNewCredential={isNewCredential}/>
        </Grid>
    ));

    return (
        <Grid container spacing={2} sx={{ marginTop: '8px', width: 'calc(100% - 16px)' }}>
            {templateAttributesCards}  
        </Grid>
    );
};

export default CredentialAttributesList;
