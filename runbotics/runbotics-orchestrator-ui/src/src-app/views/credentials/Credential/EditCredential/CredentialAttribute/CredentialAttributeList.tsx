import { FC, useEffect } from 'react';

import { Grid } from '@mui/material';

import { PrivilegeType } from 'runbotics-common';

import LoadingScreen from '#src-app/components/utils/LoadingScreen';
import useAuth from '#src-app/hooks/useAuth';
import { useDispatch, useSelector } from '#src-app/store';

import { credentialsActions } from '#src-app/store/slices/Credentials';
import { credentialTemplatesActions, credentialTemplatesSelector } from '#src-app/store/slices/CredentialTemplates';

import { FrontCredentialCollectionDto } from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';

import TemplateAttribute from './TemplateAttribute';
import { FrontCredentialDto } from '../../Credential.types';

interface CredentialAttributesListProps {
    credential: FrontCredentialDto;
    templateId: string;
    isNewCredential: boolean;
    currentCollection: FrontCredentialCollectionDto;
}

const CredentialAttributesList: FC<CredentialAttributesListProps> = ({ credential, templateId, isNewCredential, currentCollection }) => {
    const dispatch = useDispatch();
    const { credentialTemplates, loading: templatesLoading } = useSelector(credentialTemplatesSelector);
    const credentialTemplate = credentialTemplates && credentialTemplates.find(template => template.id === templateId);
    const { user } = useAuth();
    const isOwner = currentCollection ? currentCollection.createdById === user.id : false;
    const hasEditAccess = currentCollection
        ? currentCollection.credentialCollectionUser.some(
            collectionUser => collectionUser.userId === user.id && collectionUser.privilegeType === PrivilegeType.WRITE
        )
        : false;
    const canEdit = isOwner || hasEditAccess;

    useEffect(() => {
        dispatch(credentialsActions.fetchOneCredential({ resourceId: credential.id }));
        if (!credentialTemplates) dispatch(credentialTemplatesActions.fetchAllTemplates());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (templatesLoading|| !credentialTemplates) return <LoadingScreen/>;

    const templateAttributesCards = credentialTemplate.attributes.map((attribute) => (
        <Grid item key={attribute.id} xl={3} lg={4} md={6} xs={12} display="flex" alignSelf="stretch">
            <TemplateAttribute credentialId={credential.id} attribute={attribute} isNewCredential={isNewCredential} canEdit={canEdit}/>
        </Grid>
    ));

    return (
        <Grid container spacing={2} sx={{ marginTop: '8px', width: 'calc(100% - 16px)'}}>
            {templateAttributesCards}
        </Grid>
    );
};

export default CredentialAttributesList;
