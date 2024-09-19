import React, { FC, useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, SvgIcon } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import CreateGeneralInfoFormDialog from './CreateGeneralInfo/CreateGeneralInfoFormDialog';

const AddCredentialButton: FC = () => {
    const { translate } = useTranslations();
    const [showDialog, setShowDialog] = useState(false);

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
            <CreateGeneralInfoFormDialog open={showDialog} onClose={() => setShowDialog(false)}/>
        </>
    );
};

export default AddCredentialButton;

