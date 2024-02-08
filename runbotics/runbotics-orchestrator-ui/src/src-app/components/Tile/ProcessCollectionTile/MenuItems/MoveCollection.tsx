import { FC } from 'react';

import { MenuItem } from '@mui/material';

import { CollectionId } from 'runbotics-common';

import { translate } from '../../../../hooks/useTranslations';

export const MoveCollection: FC<{ id: CollectionId }> = ({ id }) => {

    const moveCollection = () => {
        // TODO: Handle collection directory change

        console.log('Move id=' + id);
    };

    return (
        <MenuItem onClick={moveCollection}>
            {translate('Process.Collection.Tile.MenuItem.Move')}
        </MenuItem>
    );
};
