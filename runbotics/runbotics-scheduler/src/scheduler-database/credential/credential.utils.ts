import { IUser } from 'runbotics-common';

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
    EDIT = 'edited',
    DELETE = 'deleted',
    CHANGE_ATTRIBUTE = 'changed attribute'
}

interface BaseCredentialChangeMailPayload {
    editorEmail: string;
    collectionCreatorEmail: string;
    collectionName: string;
    credentialName: string;
}

interface BaseCredentialNotifyMailArgs {
    executor: IUser;
    collectionId: string;
    credentialName: string;
}

interface OperationWithAttribute {
    operationType: CredentialOperationType.CHANGE_ATTRIBUTE;
    attributeName: string;
}

interface OperationWithoutAttribute {
    operationType:
        | CredentialOperationType.DELETE
        | CredentialOperationType.EDIT;
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