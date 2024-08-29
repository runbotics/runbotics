import _ from 'lodash';
import { ProcessCredential } from 'runbotics-common';

import { ActionCredentialType } from '#src-app/credentials/actionCredentialType.enum';

export interface CredentialInAction {
    authorName: string;
    collectionName: string;
    name: string;
    order: number;
    id: string;
};

export interface ActionCredentials extends Partial<Record<ActionCredentialType, CredentialInAction[]>> {};

export interface ActionSortedColumns extends Array<{
    count: number,
    actionCredentials: {
        name: string,
        credentials: CredentialInAction[]
    }[]
}> {};

export const sortByActionCredentialType = (
    credentials: ProcessCredential[],
    credentialTypes: ActionCredentialType[]
): ActionCredentials => {
    const actions: ActionCredentials = credentialTypes.reduce((acc, type) => (acc[type] = [], acc), {});
    credentials.forEach(pc => {
        actions[pc.credential.template.name as ActionCredentialType].push({
            authorName: pc.credential.createdBy.login,
            collectionName: pc.credential.collection.name,
            name: pc.credential.name,
            order: pc.order,
            id: pc.id
        });
    });

    return actions;
};

export const sortByColumns = (actions: ActionCredentials, rowCount: number): ActionSortedColumns =>
    Object.keys(actions)
        .sort((a, b) => actions[b].length - actions[a].length)
        .reduce((acc, actionType) => {
            const minSize = Math.min(...acc.map(el => el.count));
            const minIndex = acc.findIndex(el => el.count === minSize);
            const orderedCredentials = actions[actionType].sort((a, b) => a.order - b.order);
            acc[minIndex].actionCredentials.push({ name: actionType, credentials: orderedCredentials });
            acc[minIndex].count += actions[actionType].length + 1;
            return acc;
        }, _.range(rowCount).map(() => ({ count: 0, actionCredentials: [] })));
