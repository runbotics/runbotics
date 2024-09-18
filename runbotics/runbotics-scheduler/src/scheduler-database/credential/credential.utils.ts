
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
    CHANGE_ATTRIBUTE = 'changed attribute for'
}

export interface CredentialChangeMail {
    editorEmail: string;
    collectionCreatorEmail: string;
    collectionName: string;
    credentialName: string;
    operationType: CredentialOperationType,
}
