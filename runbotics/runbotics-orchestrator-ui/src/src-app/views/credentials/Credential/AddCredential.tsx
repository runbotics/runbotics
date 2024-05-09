import React, { FC } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, SvgIcon } from '@mui/material';

import { useRouter } from 'next/router';

import useTranslations from '#src-app/hooks/useTranslations';

import { Credential } from './Credential.types';

const AddCredential: FC = () => {
    const { translate } = useTranslations();
    const router = useRouter();

    const createCredentialRedirect = (credential: Credential) => {
        const credentialId = 'credentialId';
        router.push(`/app/credentials/${credentialId}/create`);
    };

    return (
        <>
            <Button
                color="primary"
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

