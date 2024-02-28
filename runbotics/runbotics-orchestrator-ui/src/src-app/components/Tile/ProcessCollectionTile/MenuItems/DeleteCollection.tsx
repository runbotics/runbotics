import { FC } from 'react';

import { MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';

import { useDispatch } from '#src-app/store';
import { deleteOne } from '#src-app/store/slices/ProcessCollection/ProcessCollection.thunks';

import { DeleteCollectionProps } from './MenuItems.types';
import { translate } from '../../../../hooks/useTranslations';

export const DeleteCollection: FC<DeleteCollectionProps> = ({ id, name }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const deleteCollection = () => {
        dispatch(deleteOne({ id }))
            .then((response) => {
                if (response.type.split('/').at(-1) === 'fulfilled') enqueueSnackbar(translate('Process.Collection.Tile.MenuItem.Delete.Success', { name }), { variant: 'success' });
                else enqueueSnackbar(translate('Process.Collection.Tile.MenuItem.Delete.Fail', { name }), { variant: 'error' });
            });
    };

    return (
        <MenuItem onClick={deleteCollection}>
            {translate('Process.Collection.Tile.MenuItem.Delete')}
        </MenuItem>
    );
};
