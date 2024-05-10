import { Grid } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import CredentialAttribute from '../CredentialAttribute/CredentialAttribute';
import { Attribute } from '../CredentialAttribute/CredentialAttribute.types';

const CredentialAttributesList = () => {
    const {translate} = useTranslations();

    const attributes: Attribute[] = [{
        id: '',
        name:'Atrubucik testowy',
        value: 'test',
        description: 'Do testowanka',
        masked: false,
        credentialId: '',
        collectionId: ''}, {
        id: '',
        name:'Atrubucik testowy',
        value: 'test',
        description: 'Do testowanka',
        masked: false,
        credentialId: '',
        collectionId: ''}];

    const attributesCards = attributes.map(attribute => 
        <Grid item key={attribute.id} xs={3}>
            <CredentialAttribute attribute={attribute}/>
        </Grid>
    );

    return (
        <Grid container spacing={2} sx={{marginTop: '16px'}} >
            {attributesCards}
            {/* created attributes */}
            {/* add attribute card */}
        </Grid>
    );
};

export default CredentialAttributesList;
