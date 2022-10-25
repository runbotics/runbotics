import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const LeavePrompt = ({open, titleText, contentText, cancelButtonText, confirmButtonText, onCancel, onConfirm}) => {

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
          {titleText}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {contentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{cancelButtonText}</Button>
          <Button onClick={onConfirm} autoFocus>
            {confirmButtonText}
          </Button>
        </DialogActions>
        </Dialog>
    )
}

export default LeavePrompt;