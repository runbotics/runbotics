import { User } from '../user/user.entity';

interface CredentialFilterQuery {
    templateName: string;
    processId: string;
}

export const isCredentialFilterQuery = (
    query: unknown
): query is CredentialFilterQuery => query
&& typeof query === 'object'
&& 'templateName' in query && typeof query.templateName === 'string'
&& 'processId' in query && typeof query.processId === 'string';

export enum CredentialOperationType {
    CREATE = 'created',
    EDIT = 'edited',
    DELETE = 'deleted',
    CHANGE_ATTRIBUTE = 'changed attribute'
}

interface BaseCredentialChangeMailPayload {
    editorEmail: string;
    collectionCreatorEmail: string;
    collectionName: string;
    credentialName: string;
    credentialOldName?: string;
}

interface BaseCredentialNotifyMailArgs {
    executor: User;
    collectionId: string;
    credentialName: string;
    credentialOldName?: string | undefined;
}

interface OperationWithAttribute {
    operationType: CredentialOperationType.CHANGE_ATTRIBUTE;
    attributeName: string;
}

interface OperationWithoutAttribute {
    operationType:
        | CredentialOperationType.DELETE
        | CredentialOperationType.EDIT
        | CredentialOperationType.CREATE;
}

export type CredentialChangeMailPayload = BaseCredentialChangeMailPayload &
    (
        | OperationWithAttribute
        | OperationWithoutAttribute
    );

export type CredentialNotifyMailArgs = BaseCredentialNotifyMailArgs &
    (
        | OperationWithAttribute
        | OperationWithoutAttribute
    );
