import { FC, useState } from 'react';

import { MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';

import CustomDialog from '#src-app/components/CustomDialog';
import { useDispatch } from '#src-app/store';
import { deleteOne } from '#src-app/store/slices/ProcessCollection/ProcessCollection.thunks';

import { DeleteCollectionProps } from './MenuItems.types';
import { translate } from '../../../../hooks/useTranslations';

export const DeleteCollection: FC<DeleteCollectionProps> = ({ id, name }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = () => {
        dispatch(deleteOne({ id }))
            .then((response) => {
                if (response.type.split('/').at(-1) === 'fulfilled') enqueueSnackbar(translate('Process.Collection.Tile.MenuItem.Delete.Success', { name }), { variant: 'success' });
                else enqueueSnackbar(translate('Process.Collection.Tile.MenuItem.Delete.Fail', { name }), { variant: 'error' });
            });
        setIsDialogOpen(false);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <>
            <MenuItem onClick={() => { setIsDialogOpen(true); }}>
                {translate('Process.Collection.Tile.MenuItem.Delete')}
            </MenuItem>
            <CustomDialog
                isOpen={isDialogOpen}
                title={translate('Process.Collection.Tile.MenuItem.Delete.ConfirmationDialog.Title', { name })}
                onClose={closeDialog}
                confirmButtonOprions={{ onClick: handleDelete }}
                cancelButtonOptions={{ onClick: closeDialog }}
            />
        </>
    );
};
