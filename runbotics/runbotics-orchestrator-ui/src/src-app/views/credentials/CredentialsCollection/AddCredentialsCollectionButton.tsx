import { useContext, useState } from 'react';

import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { Button, SvgIcon } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import CredentialsCollectionForm from './CredentialsCollectionForm';
import { PagingContext } from '../GridView/Paging.provider';

const AddCredentialsCollectionButton = () => {
    const { translate } = useTranslations();
    const [showDialog, setShowDialog] = useState(false);
    const { pageSize } = useContext(PagingContext);

    return (
        <>
            <Button
                color="primary"
                variant="contained"
                onClick={() => setShowDialog(true)}
                startIcon={
                    <SvgIcon fontSize="small">
                        <CreateNewFolderOutlinedIcon />
                    </SvgIcon>
                }
            >
                {translate('Credentials.Collection.Add')}
            </Button>
            <CredentialsCollectionForm
                open={showDialog}
                onClose={() => setShowDialog(false)}
                collection={null}
                pageSize={pageSize}
            />
        </>
    );
};

export default AddCredentialsCollectionButton;
