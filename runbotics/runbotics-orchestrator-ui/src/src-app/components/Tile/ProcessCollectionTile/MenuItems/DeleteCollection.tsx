import { MenuItem } from '@mui/material';
import { FC } from 'react';
import { CollectionId } from '../ProcessCollectionTile.types';
import { translate } from '../../../../hooks/useTranslations';

export const DeleteCollection: FC<{ id: CollectionId }> = ({ id }) => {

    const deleteCollection = () => {
        console.log('Remove id=' + id);
    };

    return (
        <MenuItem onClick={deleteCollection}>
            {translate('Process.Collection.Tile.MenuItem.Delete')}
        </MenuItem>
    );
};
