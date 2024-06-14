import { useState } from 'react';

import { Grid } from '@mui/material';

import { useSelector } from '#src-app/store';

import { AddAttribute } from '../CredentialAttribute/AddAttribute';
import CredentialAttribute from '../CredentialAttribute/CredentialAttribute';
import { EditAtributeDto } from '../CredentialAttribute/CredentialAttribute.types';
import { initialAttributeValues, initialAttributes } from '../CredentialAttribute/CredentialAttribute.utils';

const CredentialAttributesList = () => {
    const [attributes, setAttributes] = useState<EditAtributeDto[]>(initialAttributes);
    const { user: currentUser } = useSelector((state) => state.auth);

    const handleAddAttribute = () => {
        // below needs to go to the confirm button on attribute
        // send attribute to the database (CreateAttributeDto)
        // get attrbiute from the database with (EditAtributeDto)
        // add to the state
        const newAttribute = {...initialAttributeValues, id: undefined, createdOn: new Date().toDateString(), createdBy: currentUser.email };
        setAttributes([...attributes, newAttribute]);
    };

    const handleAttributeChange = (updatedAttribute: EditAtributeDto) => {
        const foundAttribute = attributes.find(attribute => attribute.id === updatedAttribute.id);
        if (foundAttribute) {
            const updatedAttributes = attributes.map(attribute => (attribute.id === updatedAttribute.id ? updatedAttribute : attribute));
            setAttributes(updatedAttributes);
        }
    };

    const handleAttributeDelete = (deletedAttribute: EditAtributeDto) => {
        const updatedAttributes = attributes.filter(attribute => attribute.id !== deletedAttribute.id);
        
        setAttributes(updatedAttributes);
        
    };

    const attributesCards = attributes.map(attribute => (
        <Grid item key={attribute.id} xs={3}>
            <CredentialAttribute attribute={attribute} setAttribute={handleAttributeChange} deleteAttribute={handleAttributeDelete} />
        </Grid>
    ));

    return (
        <Grid container spacing={2} sx={{ marginTop: '8px' }}>
            {attributesCards}
            <Grid item xs={3}>
                <AddAttribute onClick={handleAddAttribute}/>
            </Grid>
        </Grid>
    );
};

export default CredentialAttributesList;
