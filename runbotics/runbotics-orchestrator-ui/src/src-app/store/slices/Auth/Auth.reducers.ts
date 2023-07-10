
import StorageManagerService from '#src-app/store/StorageManager.service';

export const updateLogout = () => {
    StorageManagerService.removeDestinationPage();
};
