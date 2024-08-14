import React, { FC, useState } from 'react';

import { MenuItem } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';
import { BasicCredentialsCollectionDto } from '#src-app/views/credentials/CredentialsCollection/CredentialsCollection.types';
import CredentialsCollectionModifyDialog from '#src-app/views/credentials/CredentialsCollection/CredentialsCollectionModifyDialog';

interface CredentialCollectionEditProps {
  collection: BasicCredentialsCollectionDto;
  handleClose(event: React.MouseEvent<HTMLElement>): void;
}

export const CredentialCollectionEdit: FC<CredentialCollectionEditProps> = ({ collection, handleClose }) => {
    const { translate } = useTranslations();
    const [showCollectionDialog, setShowCollectionDialog] = useState<boolean>(false);

    const toggleShowDialog = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.stopPropagation();
        setShowCollectionDialog(!showCollectionDialog);
    };


    return (
        <>
            <MenuItem onClick={(e) => toggleShowDialog(e)}>
                {translate('Credentials.Collection.Tile.MenuItem.Edit')}
            </MenuItem>
            <CredentialsCollectionModifyDialog
                open={showCollectionDialog}
                onClose={(e) => {
                    setShowCollectionDialog(false);
                    handleClose(e);
                }}
                collection={collection}
            />
        </>
    );
};
