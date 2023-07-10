export enum StorageKey {
    DESTINATION_PAGE='destination_page',
    ACCESS_TOKEN='access_token'
}

class StorageManagerService {
    // --= Private =--
    private static setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    private static readItem(key: string): string {
        try {
            const data = localStorage.getItem(key);
            return data;
        } catch(error) {
            // eslint-disable-next-line no-console
            console.log(error);
            return '';
        }
    }

    private static removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch(error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    }

    private static clearAll(): void {
        localStorage.clear();
    }

    // --= Public =--
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
        const page = StorageManagerService.readItem(StorageKey.DESTINATION_PAGE);
        return page;
    }

    public static removeDestinationPage(): void {
        StorageManagerService.removeItem(StorageKey.DESTINATION_PAGE);
    }

}

export default StorageManagerService;
