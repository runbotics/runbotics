import { useState, VFC } from 'react';

import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Typography } from '@mui/material';
import { BotCollectionDto } from 'runbotics-common';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

const CopyMessage = styled.div<{ copySuccess: boolean }>`
    display: flex;
    justify-content: center;
    visibility: ${({ copySuccess }) => (copySuccess ? 'visible' : 'hidden')};
    padding-top: 0.625rem;
`;

type IdentifierBotCollectionDialogProps = {
    open?: boolean;
    botCollection: BotCollectionDto;
    onClose: () => void;
};

const BotCollectionIdentifierDialog: VFC<IdentifierBotCollectionDialogProps> = (props) => {
    const [copySuccess, setCopySuccess] = useState<boolean>(false);
    const { translate, translateHTML } = useTranslations();

    const handleCopy = async () => {
        await navigator.clipboard.writeText(props.botCollection.id);
        setCopySuccess(true);
    };

    const handleClose = () => {
        props.onClose();
        setCopySuccess(false);
    };

    return (
        <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
            <DialogTitle>{translate('Bot.Collection.Dialog.Identifier.Title')}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column">
                    <Typography variant="body1">
                        {translateHTML('Bot.Collection.Dialog.Identifier.Message', { name: props.botCollection.name })}
                    </Typography>
                    <Box display="flex">
                        <Input value={props.botCollection.id} readOnly fullWidth margin="dense" />
                        <Button autoFocus variant="contained" color="primary" onClick={handleCopy}>
                            <FileCopyIcon />
                        </Button>
                    </Box>
                    <CopyMessage copySuccess={copySuccess}>
                        <Typography variant="caption">{translate('Common.Copied')}</Typography>
                    </CopyMessage>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleClose}>
                    {translate('Common.Close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BotCollectionIdentifierDialog;
