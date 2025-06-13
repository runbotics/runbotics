import React, { FC, ReactNode, useEffect, useState } from 'react';

import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack';

const SnackbarProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    const [rootBodyEl, setRootBodyEl] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setRootBodyEl(document.body);
        }
    }, []);

    return (
        <NotistackSnackbarProvider
            dense
            disableWindowBlurListener
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            domRoot={rootBodyEl}
        >
            {children}
        </NotistackSnackbarProvider>
    );
};

export default SnackbarProvider;
