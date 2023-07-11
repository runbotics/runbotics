
import StorageManagerService from '#src-app/store/StorageManager.service';

export const handleLogout = () => {
    StorageManagerService.removeDestinationPage();
};
