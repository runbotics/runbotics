import { MenuItem } from '@mui/material';
import { FC } from 'react';
import { CollectionId } from '../ProcessCollectionTile.types';
import { translate } from '../../../../hooks/useTranslations';

export const MoveCollection: FC<{ id: CollectionId }> = ({ id }) => {

    const moveCollection = () => {
        console.log('Move id=' + id)
    };

    return (
        <MenuItem onClick={moveCollection}>
            {translate('Process.Collection.Tile.MenuItem.Move')}
        </MenuItem>
    );
};
