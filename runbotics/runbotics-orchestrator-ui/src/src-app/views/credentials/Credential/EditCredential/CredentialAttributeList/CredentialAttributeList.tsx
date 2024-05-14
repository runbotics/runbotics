import { useState } from 'react';

import { Grid } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { AddAttribute } from '../CredentialAttribute/AddAttribute';
import CredentialAttribute from '../CredentialAttribute/CredentialAttribute';
import { Attribute } from '../CredentialAttribute/CredentialAttribute.types';
import { initialAttributeValues, initialAttributes } from '../CredentialAttribute/CredentialAttribute.utils';

const CredentialAttributesList = () => {
    const { translate } = useTranslations();
    const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);

    const handleAddAttribute = () => {
        const newAttribute = {...initialAttributeValues, id: `${attributes.length + 1}` };
        setAttributes([...attributes, newAttribute]);
    };

    const handleAttributeChange = (updatedAttribute: Attribute) => {
        const foundAttribute = attributes.find(attribute => attribute.id === updatedAttribute.id);
        if (foundAttribute) {
            const updatedAttributes = attributes.map(attribute => (attribute.id === updatedAttribute.id ? updatedAttribute : attribute));
            setAttributes(updatedAttributes);
        }
    };

    const handleAttributeDelete = (deletedAttribute: Attribute) => {
        const updatedAttributes = attributes.filter(attribute => attribute.id !== deletedAttribute.id);
        
        setAttributes(updatedAttributes);
        
    };

    const attributesCards = attributes.map(attribute => (
        <Grid item key={attribute.id} xs={3}>
            <CredentialAttribute attribute={attribute} setAttribute={handleAttributeChange} deleteAttribute={handleAttributeDelete} />
        </Grid>
    ));

    return (
        <Grid container spacing={2} sx={{ marginTop: '16px' }}>
            {attributesCards}
            {/* created attributes */}
            {/* add attribute card */}
            <Grid item xs={3}>
                <AddAttribute onClick={handleAddAttribute}/>
            </Grid>
        </Grid>
    );
};

export default CredentialAttributesList;
