import React, { FC, useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, SvgIcon } from '@mui/material';

import { useRouter } from 'next/router';

import useTranslations from '#src-app/hooks/useTranslations';

import { BasicCredentialDto, CreateCredentialDto } from './Credential.types';
import { CreateGeneralInfo } from './GeneralInfo/CreateGeneralInfo';

const AddCredentialButton: FC = () => {
    const { translate } = useTranslations();
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();

    const handleAdd = () => {};
    
    const createCredentialRedirect = (credential: CreateCredentialDto) => {
        // use initialCredentialData add a new object in database
        // dispatch(createUser(initialCollectionData))
        const newCredential: Partial<BasicCredentialDto> = {...credential, id: 'jakies_id'};
        // get object from the database with added properties handled by backend (id, createdBy, createdOn)
        // go to utl dedicated to this credential (/:id)
        console.log(newCredential);
        router.push(`/app/credentials/${newCredential.id}`);
    };

    return (
        <>
            <Button
                color="primary"
                variant="contained"
                onClick={() => setShowDialog(true)}
                startIcon={
                    <SvgIcon fontSize="small">
                        <AddCircleOutlineIcon />
                    </SvgIcon>
                }
            >
                {translate('Credentials.Add')}
            </Button>
            <CreateGeneralInfo open={showDialog} onClose={() => setShowDialog(false)} onAdd={createCredentialRedirect}/>
        </>
    );
};

export default AddCredentialButton;

