import React, { FC, useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, SvgIcon } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

const AddNewCredentialButton: FC = () => {
    const {translate} = useTranslations();
    const [showDialog, setShowDialog] = useState(false);

    return (
        <>
            <Button
                color="primary"
                variant="contained"
                onClick={() => setShowDialog(true)}
                startIcon={(
                    <SvgIcon fontSize="small">
                        <AddCircleOutlineIcon />
                    </SvgIcon>
                )}
            >
                {translate('Credentials.Add')}
            </Button>
            {/* Edit process dialog */}
        </>

    );
};

export default AddNewCredentialButton;
