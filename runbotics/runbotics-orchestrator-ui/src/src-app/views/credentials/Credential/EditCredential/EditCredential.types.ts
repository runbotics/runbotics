import { Credential } from '../Credential.types';

export interface EditCredentialProps {
    credential: Credential
    onClose: () => void;
    onAdd: (credential: Credential) => void;
    open?: boolean;
}

// export interface FormValidationState {
//     name: boolean;
// }
