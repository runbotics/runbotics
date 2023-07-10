
// import { PayloadAction } from '@reduxjs/toolkit';

// import { initialState } from './Auth.slice';
// import { AuthState } from './Auth.state';

import StorageManagerService from '#src-app/store/StorageManager.service';

export const updateLogout = () => {
    StorageManagerService.removeDestinationPage();
};
