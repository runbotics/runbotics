import { BasicCredentialDto } from '../Credential.types';

export interface EditCredentialProps {
    credential: Credential
    onClose: () => void;
    onAdd: (credential: BasicCredentialDto) => void;
    open?: boolean;
}

// export interface FormValidationState {
//     name: boolean;
// }
