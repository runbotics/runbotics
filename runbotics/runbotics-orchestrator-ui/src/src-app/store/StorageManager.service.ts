export enum StorageKey {
    DESTINATION_PAGE = 'destination_page',
    ACCESS_TOKEN = 'access_token'
}

class StorageManagerService {
    private static setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    private static readItem(key: string): string {
        try {
            return localStorage.getItem(key);
            
        } catch(error) {
            return '';
        }
    }

    private static removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch(error) {}
    }

    private static clearAll(): void {
        localStorage.clear();
    }

    // Access Token
    public static insertAccessToken(token: string): void {
        StorageManagerService.setItem(StorageKey.ACCESS_TOKEN, token);
    }

    public static removeAccessToken() {
        StorageManagerService.removeItem(StorageKey.ACCESS_TOKEN);
    }

    // Destination Page
    public static insertDestinationPage(page: string): void {
        StorageManagerService.setItem(StorageKey.DESTINATION_PAGE, page);
    }

    public static readDestinationPage(): string {
        return StorageManagerService.readItem(StorageKey.DESTINATION_PAGE);
    }

    public static removeDestinationPage(): void {
        StorageManagerService.removeItem(StorageKey.DESTINATION_PAGE);
    }

}

export default StorageManagerService;
