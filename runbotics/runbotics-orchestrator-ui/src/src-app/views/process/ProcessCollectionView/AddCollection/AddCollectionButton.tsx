import React, { FC, useState } from 'react';

import { Button, SvgIcon } from '@mui/material';
import { FolderPlus } from 'react-feather';

import { AddCollectionButtonProps } from './AddCollection.types';
import { translate } from '../../../../hooks/useTranslations';
import ProcessCollectionModifyDialog from '../ProcessCollectionModifyDialog/ProcessCollectionModifyDialog';

const AddCollectionButton: FC<AddCollectionButtonProps> = ({ collectionData }) => {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <>
            <Button
                color="primary"
                variant="contained"
                onClick={() => setShowDialog(true)}
                startIcon={(
                    <SvgIcon fontSize="small">
                        <FolderPlus />
                    </SvgIcon>
                )}
            >
                {translate('Process.Collection.Add.Button')}
            </Button>
            <ProcessCollectionModifyDialog
                open={showDialog}
                onClose={() => setShowDialog(false)}
                collection={collectionData}
            />
        </>

    );
};

export default AddCollectionButton;

