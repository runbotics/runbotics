import React, { VFC } from 'react';
import { IBotCollection } from 'runbotics-common';
import useTranslations from 'src/hooks/useTranslations';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from '@mui/material';
import { useDispatch } from '../../../../../store';
import { botCollectionActions } from '../../../../../store/slices/BotCollections';
import { PageRequestParams } from '../../../../../utils/types/page';

type DeleteBotCollectionDialogProps = {
    open?: boolean;
    botCollection: IBotCollection;
    onClose: () => void;
    onDelete: (botCollection: IBotCollection) => void;
    pageParams: PageRequestParams<Partial<IBotCollection>>;
};

const BotCollectionDeleteDialog: VFC<DeleteBotCollectionDialogProps> = ({
    open, botCollection, onClose, onDelete, pageParams,
}) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();

    const handleSubmit = async () => {
        await dispatch(botCollectionActions.deleteOne({ collectionId: botCollection.id }))
            .then(() => dispatch(botCollectionActions.getByPage(pageParams)));
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
