import React, { FC, useState } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, SvgIcon } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import EditCredentialsCollection from './EditCredentialsCollection/EditCredentialsCollection';
import { getInitialCredentialsCollectionData } from './EditCredentialsCollection/EditCredentialsCollection.utils';

const AddCredentialsCollection: FC = () => {
    const { translate } = useTranslations();
    const [showDialog, setShowDialog] = useState(false);

    const initialCredentialsCollectionInfo = getInitialCredentialsCollectionData();
    const handleAdd = () => {};

    return (
        <>
            <Button
                color="secondary"
                variant="contained"
                onClick={() => setShowDialog(true)}
                startIcon={
                    <SvgIcon fontSize="small">
                        <AddCircleOutlineIcon />
                    </SvgIcon>
                }
            >
                {translate('Credentials.Collection.Add')}
            </Button>
            <EditCredentialsCollection
                open={showDialog}
                onClose={() => setShowDialog(false)}
                onAdd={handleAdd}
                collection={initialCredentialsCollectionInfo}
            />
        </>
    );
};

export default AddCredentialsCollection;
