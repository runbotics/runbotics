import { CredentialAttribute } from "./attribute.model";

export interface Credential {
    id: string;
    name: string;
    attributes: CredentialAttribute[];
}