import React, { FC, useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, SvgIcon } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import EditCredential from './EditCredential/EditCredential';
import { getInitialCredentialData } from './EditCredential/EditCredential.utils';

const AddCredential: FC = () => {
    const { translate } = useTranslations();
    const [showDialog, setShowDialog] = useState(false);

    const initialCredentialInfo = getInitialCredentialData();
    const handleAdd = () => {};

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
            <EditCredential open={showDialog} onClose={() => setShowDialog(false)} onAdd={handleAdd} credential={initialCredentialInfo} />
        </>
    );
};

export default AddCredential;

