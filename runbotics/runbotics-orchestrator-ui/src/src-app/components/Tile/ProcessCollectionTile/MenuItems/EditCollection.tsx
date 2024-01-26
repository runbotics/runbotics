import { MenuItem } from '@mui/material';
import { FC } from 'react';
import { ProcessCollectionTileProps } from '../ProcessCollectionTile.types';
import { translate } from '../../../../hooks/useTranslations';

export const EditCollection: FC<ProcessCollectionTileProps> = (props) => {

    const editCollection = () => {
        console.log(props);
    };

    return (
        <MenuItem onClick={editCollection}>
            {translate('Process.Collection.Tile.MenuItem.Edit')}
        </MenuItem>
    );
};
