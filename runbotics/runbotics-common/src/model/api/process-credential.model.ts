import { UserDTO } from './user.model';

export interface ProcessCredential {
    id: string;
    order: number;
    credential: {
        id: string;
        name: string;
        createdBy: UserDTO;
        template: {
            id: string;
            name: string;
        },
        collection: {
            id: string;
            name: string;
        }
    }
}
