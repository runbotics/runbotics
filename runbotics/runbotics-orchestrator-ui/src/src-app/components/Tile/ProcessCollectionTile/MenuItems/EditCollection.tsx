import { FC } from 'react';

import { MenuItem } from '@mui/material';

import { ProcessCollection } from 'runbotics-common';

import { translate } from '../../../../hooks/useTranslations';

export const EditCollection: FC<ProcessCollection> = (props) => {

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
