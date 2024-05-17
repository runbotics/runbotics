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
        const newCredential = getInitialCredentialData();
        newCredential.id = 'newCredentialId';
        router.push(`/app/credentials/${newCredential.id}`);
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

