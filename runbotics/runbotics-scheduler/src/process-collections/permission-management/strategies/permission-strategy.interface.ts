export interface PermissionStrategy {
    execute(): Promise<void>;
}
