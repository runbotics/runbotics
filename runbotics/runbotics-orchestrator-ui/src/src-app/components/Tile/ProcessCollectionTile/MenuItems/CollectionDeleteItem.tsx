import { FC, useState } from 'react';

import { Box, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';


import ConditionalTooltip from '#src-app/components/ConditionalTooltip/ConditionalTooltip';
import CustomDialog from '#src-app/components/CustomDialog';
import { useDispatch } from '#src-app/store';
import { deleteOne } from '#src-app/store/slices/ProcessCollection/ProcessCollection.thunks';


import { CollectionDeleteItemProps } from './MenuItems.types';
import { translate } from '../../../../hooks/useTranslations';

export const CollectionDeleteItem: FC<CollectionDeleteItemProps> = ({ id, name, isOwner }) => {
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

    const toggleDialog = () => {
        setIsDialogOpen(prevState => !prevState);
    };

    return (
        <>
            <Box display="flex">
                <ConditionalTooltip display={!isOwner} title={translate('Process.Collection.Tile.MenuItem.Delete.Info')}>
                    <MenuItem onClick={toggleDialog} disabled={!isOwner}>
                        {translate('Process.Collection.Tile.MenuItem.Delete')}
                    </MenuItem>
                </ConditionalTooltip>
            </Box>
            <CustomDialog
                isOpen={isDialogOpen}
                title={translate('Process.Collection.Tile.MenuItem.Delete.ConfirmationDialog.Title', { name })}
                onClose={toggleDialog}
                confirmButtonOptions={{ onClick: handleDelete }}
                cancelButtonOptions={{ onClick: toggleDialog }}
            />
        </>
    );
};
