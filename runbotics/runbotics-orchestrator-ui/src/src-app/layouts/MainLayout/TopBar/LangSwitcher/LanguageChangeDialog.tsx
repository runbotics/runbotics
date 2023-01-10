import { VFC } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import { StyledTitle } from './LangSwitcher.styled';




interface DialogProps {
    onConfirm: () => void;
    onCancel: () => void;
    isDialogOpen: boolean;
}

const LanguageChangeDialog: VFC<DialogProps> = ({onConfirm, onCancel, isDialogOpen}) => {
    const { translate } = useTranslations();

    return (
        <Dialog
            open={isDialogOpen}
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
                <Button onClick={onCancel} autoFocus>
                    {translate('Process.Modeler.DialogCancel')}
                </Button>
                <Button onClick={onConfirm}>
                    {translate('Process.Modeler.DialogConfirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LanguageChangeDialog;
