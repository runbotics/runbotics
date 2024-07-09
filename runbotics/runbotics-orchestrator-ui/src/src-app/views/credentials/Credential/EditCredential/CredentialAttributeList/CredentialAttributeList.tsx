
import { FC, useEffect } from 'react';

import { CircularProgress, Grid } from '@mui/material';

import If from '#src-app/components/utils/If';
import { useDispatch, useSelector } from '#src-app/store';

import { addAttribute, deleteAttribute, fetchAttributes, updateAttribute } from '#src-app/store/slices/CredentialAttributes/CredentialAttributes.thunks';
import { fetchAllTemplates } from '#src-app/store/slices/CredentialTemplates/CredentialTemplates.thunks';
import { EditAtributeDto, initialCredentialAttributeValues } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/CredentialAttribute.types';

import { AddAttribute } from '../CredentialAttribute/AddAttribute';
import CredentialAttribute from '../CredentialAttribute/CredentialAttribute';
import CredentialAttributeCustom from '../CredentialAttribute/CredentialAttributeCustom';

interface CredentialAttributesListProps {
    templateId: string;
}

const CredentialAttributesList: FC<CredentialAttributesListProps> = ({templateId}) => {
    const dispatch = useDispatch();
    const attributes = useSelector(state => state.credentialAttributes.data);
    const { user: currentUser } = useSelector((state) => state.auth);
    const templates = useSelector(state => state.credentialTemplates.data);
    const credentialTemplate = templates.find(template => template.id === templateId);
    const isTemplateCustom = templateId === '1v400222-5db2-4454-8df5-1ee0aa1e123d';
    const templatesLoading = useSelector(state => state.credentialTemplates.loading);

    useEffect(() => {
        dispatch(fetchAttributes('123456dd-031b-42a7-bc30-0dec69d12345'));
    }, [dispatch, credentialTemplate]);

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
      
    const handleAddAttribute = () => {
        // below needs to go to the confirm button on attribute
        // send attribute to the database (CreateAttributeDto)
        // get attrbiute from the database with (EditAtributeDto)
        // add to the state
        const newAttribute = {...initialCredentialAttributeValues, id: 'siema', createdOn: new Date().toDateString(), createdBy: currentUser.email };
        dispatch(addAttribute(newAttribute));
    };

    const handleAttributeChange = (updatedAttribute: EditAtributeDto) => {
        const foundAttribute = attributes.find(attribute => attribute.id === updatedAttribute.id);
        if (foundAttribute) {
            dispatch(updateAttribute(updatedAttribute));
        }
    };

    const handleAttributeDelete = (attributeToDelete: EditAtributeDto) => {
        dispatch(deleteAttribute(attributeToDelete.id));
    };

    const templateAttributesCards = credentialTemplate.attributes.map(attribute => (
        <Grid item key={attribute.id} xl={3} lg={4} md={6} xs={12}>
            <CredentialAttribute attribute={attribute} setAttribute={handleAttributeChange}/>
        </Grid>
    ));

    const customAttributesCards = attributes.map(attribute => (
        <Grid item key={attribute.id} xl={3} lg={4} md={6} xs={12}>
            <CredentialAttributeCustom attribute={attribute} setAttribute={handleAttributeChange} deleteAttribute={handleAttributeDelete} template={credentialTemplate} />
        </Grid>
    ));

    return (
        <Grid container spacing={2} sx={{ marginTop: '8px', width: 'calc(100% - 16px)' }}>
            <If condition={isTemplateCustom} else={templateAttributesCards}>
                {customAttributesCards}
                <Grid item xl={3} lg={4} md={6} xs={12}>
                    <AddAttribute onClick={handleAddAttribute}/>
                </Grid>
            </If>
        </Grid>
    );
};

export default CredentialAttributesList;
