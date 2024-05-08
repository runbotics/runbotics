export interface CredentialsCollection {
    id?: string;
    name: string;
    description: string;
    access: string; // enum
    collectionColor: string; // enum
    location: string;
    sharedWith: string[];
}
