import { FC, useState } from 'react';

import { MenuItem } from '@mui/material';

import ProcessCollectionModifyDialog from '#src-app/views/process/ProcessCollectionView/ProcessCollectionModifyDialog/ProcessCollectionModifyDialog';

import { CollectionEditItemProps } from './MenuItems.types';
import { translate } from '../../../../hooks/useTranslations';

export const CollectionEditItem: FC<CollectionEditItemProps> = ({ collection, onClose: _onClose }) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const toggleShowDialog = () => {
        setShowDialog(!showDialog);
    };

    return (
        <>
            <MenuItem onClick={toggleShowDialog}>
                {translate('Process.Collection.Tile.MenuItem.Edit')}
            </MenuItem>
            <ProcessCollectionModifyDialog collection={collection} open={showDialog} onClose={toggleShowDialog} />
        </>
    );
};
