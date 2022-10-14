import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import useTranslations from 'src/hooks/useTranslations';

interface DialogProps {
    handleDialogLoseChanges: () => void;
    handleDialogCancel: () => void;
    openDialog: boolean;
}

const LanguageChangeDialog = ({handleDialogLoseChanges, handleDialogCancel, openDialog} : DialogProps) => {
    const { translate } = useTranslations();

    return (
        <Dialog
            open={openDialog}
        >
            <DialogContent>
                <DialogContentText>
                    {translate('Process.Modeler.LeavePrompt')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogLoseChanges}>Ok</Button>
                <Button onClick={handleDialogCancel} autoFocus>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LanguageChangeDialog;