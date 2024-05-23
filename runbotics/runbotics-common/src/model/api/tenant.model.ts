import { UserDTO } from "./user.model";

export interface Tenant {
    id?: string;
    name?: string;
    createdBy?: UserDTO;
    created?: string | null;
    updated?: string | null;
    lastModifiedBy?: string | null;
}