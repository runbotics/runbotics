
import { FC, useEffect } from 'react';

import { Grid } from '@mui/material';

import If from '#src-app/components/utils/If';
import { useDispatch, useSelector } from '#src-app/store';

import { addAttribute, deleteAttribute, fetchAttributes, updateAttribute } from '#src-app/store/slices/CredentialAttributes/CredentialAttributes.thunks';
import { EditAtributeDto, initialCredentialAttributeValues } from '#src-app/views/credentials/Credential/EditCredential/CredentialAttribute/CredentialAttribute.types';

import { CredentialTemplate, CredentialTemplateNames } from '../../Credential.types';
import { AddAttribute } from '../CredentialAttribute/AddAttribute';
import CredentialAttribute from '../CredentialAttribute/CredentialAttribute';

interface CredentialAttributesListProps {
    template: CredentialTemplate;
}

const CredentialAttributesList: FC<CredentialAttributesListProps> = ({template}) => {
    // const [attributes, setAttributes] = useState<EditAtributeDto[]>(initialAttributes);
    const dispatch = useDispatch();
    const attributes = useSelector(state => state.credentialAttributes.data);
    const { user: currentUser } = useSelector((state) => state.auth);
    // need to find if the credential has templates

    useEffect(() => {
        dispatch(fetchAttributes('tymczasowe_id'));
    }, [dispatch]);

    useEffect(() => {
        console.log('Attributes:', attributes);
    }, [attributes]);
      
    const handleAddAttribute = () => {
        // below needs to go to the confirm button on attribute
        // send attribute to the database (CreateAttributeDto)
        // get attrbiute from the database with (EditAtributeDto)
        // add to the state
        const newAttribute = {...initialCredentialAttributeValues, id: 'siema', createdOn: new Date().toDateString(), createdBy: currentUser.email };
        console.log(newAttribute);
        dispatch(addAttribute(newAttribute));
    };

    const handleAttributeChange = (updatedAttribute: EditAtributeDto) => {
        const foundAttribute = attributes.find(attribute => attribute.id === updatedAttribute.id);
        if (foundAttribute) {
            dispatch(updateAttribute(updatedAttribute));
        }
    };

    const handleAttributeDelete = (attributeToDelete: EditAtributeDto) => {
        // const updatedAttributes = attributes.filter(attribute => attribute.id !== attributeToDelete.id);
        console.log('attributeToDelete', attributeToDelete);
        dispatch(deleteAttribute(attributeToDelete.id));
    };

    const templateAttributesCards = template.attributes.map(attribute => (
        <Grid item key={attribute.id} xl={3} lg={4} md={6} xs={12}>
            <CredentialAttribute attribute={attribute} setAttribute={handleAttributeChange} deleteAttribute={handleAttributeDelete} template={template} />
        </Grid>
    ));

    const customAttributesCards = attributes.map(attribute => (
        <Grid item key={attribute.id} xl={3} lg={4} md={6} xs={12}>
            <CredentialAttribute attribute={attribute} setAttribute={handleAttributeChange} deleteAttribute={handleAttributeDelete} template={template} />
        </Grid>
    ));

    return (
        <Grid container spacing={2} sx={{ marginTop: '8px', width: 'calc(100% - 16px)' }}>
            <If condition={template.name === CredentialTemplateNames.CUSTOM} else={templateAttributesCards}>
                {customAttributesCards}
            </If>
            <Grid item xl={3} lg={4} md={6} xs={12}>
                <AddAttribute onClick={handleAddAttribute}/>
            </Grid>
        </Grid>
    );
};

export default CredentialAttributesList;
