import { FC } from 'react';

import { MenuItem } from '@mui/material';

import { translate } from '../../../../hooks/useTranslations';
import { CollectionId } from '../ProcessCollectionTile.types';

export const DeleteCollection: FC<{ id: CollectionId }> = ({ id }) => {

    const deleteCollection = () => {
        // TODO: Handle collection deletion

        console.log('Remove id=' + id);
    };

    return (
        <MenuItem onClick={deleteCollection}>
            {translate('Process.Collection.Tile.MenuItem.Delete')}
        </MenuItem>
    );
};
