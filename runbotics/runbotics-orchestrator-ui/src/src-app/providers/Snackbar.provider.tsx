import React, { FC, ReactNode } from 'react';

import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack';

const SnackbarProvider: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => (
    <NotistackSnackbarProvider
        dense
        disableWindowBlurListener
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
    >
        {children}
    </NotistackSnackbarProvider>
);

export default SnackbarProvider;
