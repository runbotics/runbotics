import { FC } from 'react';

import { MenuItem } from '@mui/material';

import { CollectionId } from 'runbotics-common';

import { translate } from '../../../../hooks/useTranslations';

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
