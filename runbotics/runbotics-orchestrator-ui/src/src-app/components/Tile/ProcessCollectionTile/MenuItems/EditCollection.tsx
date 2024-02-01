import { FC } from 'react';

import { MenuItem } from '@mui/material';

import { translate } from '../../../../hooks/useTranslations';
import { ProcessCollectionTileProps } from '../ProcessCollectionTile.types';

export const EditCollection: FC<ProcessCollectionTileProps> = (props) => {

    const editCollection = () => {
        // TODO: Handle collection edition

        console.log(props);
    };

    return (
        <MenuItem onClick={editCollection}>
            {translate('Process.Collection.Tile.MenuItem.Edit')}
        </MenuItem>
    );
};
