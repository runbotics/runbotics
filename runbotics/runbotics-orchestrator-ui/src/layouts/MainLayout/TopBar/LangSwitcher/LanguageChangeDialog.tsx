import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import useTranslations from 'src/hooks/useTranslations';
import { StyledTitle } from './LangSwitcher.styled';
import { VFC } from 'react';

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
