import React, { VFC } from 'react';

import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';
import { BotCollectionDto } from 'runbotics-common';


import useTranslations from '#src-app/hooks/useTranslations';

import { useDispatch } from '#src-app/store';
import { botCollectionActions } from '#src-app/store/slices/BotCollections';
import { PageRequestParams } from '#src-app/utils/types/page';


type DeleteBotCollectionDialogProps = {
    open?: boolean;
    botCollection: BotCollectionDto;
    onClose: () => void;
    onDelete: (botCollection: BotCollectionDto) => void;
    pageParams: PageRequestParams<Partial<BotCollectionDto>>;
};

const BotCollectionDeleteDialog: VFC<DeleteBotCollectionDialogProps> = ({
    open,
    botCollection,
    onClose,
    onDelete,
    pageParams,
}) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();

    const handleSubmit = async () => {
        await dispatch(botCollectionActions.deleteOne({ resourceId: botCollection.id }))
            .then(() => dispatch(botCollectionActions.getByPage({ pageParams })));
        onDelete(botCollection);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {translate('Bot.Collection.Dialog.Delete.Title', { name: botCollection.name })}
            </DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    {translate('Bot.Collection.Dialog.Delete.Message', { name: botCollection.name })}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={onClose}
                >
                    {translate('Common.Cancel')}
                </Button>
                <Button variant="contained" color="primary" autoFocus onClick={handleSubmit}>
                    {translate('Common.Confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BotCollectionDeleteDialog;
