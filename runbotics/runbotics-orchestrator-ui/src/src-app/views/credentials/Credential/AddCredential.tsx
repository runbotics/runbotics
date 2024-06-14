import React, { FC } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, SvgIcon } from '@mui/material';

import { useRouter } from 'next/router';

import useTranslations from '#src-app/hooks/useTranslations';

import { getInitialCredentialData } from './EditCredential/EditCredential.utils';

const AddCredential: FC = () => {
    const { translate } = useTranslations();
    const router = useRouter();
    
    const createCredentialRedirect = () => {
        const initialCredentialData = getInitialCredentialData();
        // use initialCredentialData add a new object in database
        // dispatch(createUser(initialCollectionData))
        // const newCredential: BasicCredentialDto = {...initialCredentialData, id: 'newCredentialId'}
        // get object from the database with added properties handled by backend (id, createdBy, createdOn)
        // go to utl dedicated to this credential (/:id)
        // router.push(`/app/credentials/${newCredential.id}`);
    };

    return (
        <>
            <Button
                color="secondary"
                variant="contained"
                onClick={createCredentialRedirect}
                startIcon={
                    <SvgIcon fontSize="small">
                        <AddCircleOutlineIcon />
                    </SvgIcon>
                }
            >
                {translate('Credentials.Add')}
            </Button>
            {/* <EditCredential open={showDialog} onClose={() => setShowDialog(false)} onAdd={handleAdd} credential={initialCredentialInfo} /> */}
        </>
    );
};

export default AddCredential;

