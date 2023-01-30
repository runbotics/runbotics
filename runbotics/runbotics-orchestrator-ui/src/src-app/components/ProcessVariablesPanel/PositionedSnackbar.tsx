import React from 'react';

import Button from '@mui/material/Button';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';

export interface State extends SnackbarOrigin {
  open: boolean;
}

export default function PositionedSnackbar({open, buttonText, message, handleCopy}) {
    const [state, setState] = React.useState<State>({
        open: open,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal } = state;

    const handleClick = (newState: SnackbarOrigin) => () => {
        handleCopy();
        setState({ open: true, ...newState });
    };

    const handleClose = () => {
        setState({ ...state, open: false });
    };
 
    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={handleClose}
                message={message}
                key={vertical + horizontal}
            />
            <Button
                onClick={handleClick({
                    vertical: 'bottom',
                    horizontal: 'right',
                })}
            >
                {buttonText}
            </Button>
        </>
    );
}
