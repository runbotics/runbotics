import React from 'react';

import Button from '@mui/material/Button';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';

export interface State extends SnackbarOrigin {
  open: boolean;
}

export default function PositionedSnackbar({buttonText, message, handleCopy}) {
    const [state, setState] = React.useState<State>({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal } = state;

    const handleClick = (newState: SnackbarOrigin) => () => {
        console.log('handlingClick');
        handleCopy();
        setState({ open: true, ...newState });
        console.log(open);
    };

    const handleClose = () => {
        console.log('handleClose');
        setState({ ...state, open: false });
    };


 
    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                autoHideDuration={2000}
                open={state.open}
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
