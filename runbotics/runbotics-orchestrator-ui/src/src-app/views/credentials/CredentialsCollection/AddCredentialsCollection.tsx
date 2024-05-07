import React, { FC, useState } from 'react';

import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';import { Button, SvgIcon } from '@mui/material';


import useTranslations from '#src-app/hooks/useTranslations';

import CredentialsCollectionModifyDialog from './CredentialsCollectionModifyDialog';

const AddCredentialsCollection: FC = () => {
    const { translate } = useTranslations();
    const [showDialog, setShowDialog] = useState(false);

    const handleAdd = () => {};

    return (
        <>
            <Button
                color='primary'
                variant='contained'
                onClick={() => setShowDialog(true)}
                startIcon={
                    <SvgIcon fontSize="small">
                        <CreateNewFolderOutlinedIcon />
                    </SvgIcon>
                }
            >
                {translate('Credentials.Collection.Add')}  
            </Button>
            <CredentialsCollectionModifyDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                collection={null}
            />
        </>
    );
};

export default AddCredentialsCollection;
