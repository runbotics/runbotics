import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import useTranslations from 'src/hooks/useTranslations';
import { StyledTitle } from './LangSwitcher.styled';

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
                <StyledTitle>
                    {translate('Process.Modeler.ChangeLanguageTitle')}
                </StyledTitle>
                <DialogContentText>
                    {translate('Process.Modeler.LoseModelerChangesContent')}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogLoseChanges}>
                    {translate('Process.Modeler.DialogConfirm')}
                </Button>
                <Button onClick={handleDialogCancel} autoFocus>
                    {translate('Process.Modeler.DialogCancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LanguageChangeDialog;