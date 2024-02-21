import { FC, useState } from 'react';

import { MenuItem } from '@mui/material';

import ProcessCollectionModifyDialog from '#src-app/views/process/ProcessCollectionView/ProcessCollectionModifyDialog/ProcessCollectionModifyDialog';

import { EditCollectionProps } from './MenuItems.types';
import { translate } from '../../../../hooks/useTranslations';

export const EditCollection: FC<EditCollectionProps> = ({ collection, onClose }) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const onEdit = () => {
        setShowDialog(true);
    };

    const onEditDialogClose = () => {
        setShowDialog(false);
    };

    return (
        <>
            <MenuItem onClick={onEdit}>
                {translate('Process.Collection.Tile.MenuItem.Edit')}
            </MenuItem>
            <ProcessCollectionModifyDialog collection={collection} open={showDialog} onClose={onEditDialogClose} />
        </>
    );
};
