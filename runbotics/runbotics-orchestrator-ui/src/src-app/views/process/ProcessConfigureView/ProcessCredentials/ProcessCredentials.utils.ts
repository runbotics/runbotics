import _ from 'lodash';
import { ActionCredentialType, ProcessCredentialDto } from 'runbotics-common';

import { ActionCredentials, ActionSortedColumns } from './ProcessCredentials.types';

export const ACTION_MIN_WIDTH = 400;
export const MARGIN_LIMIT = 800;

export const sortByActionCredentialType = (
    credentials: ProcessCredentialDto[],
    credentialTypes: ActionCredentialType[]
): ActionCredentials => {
    const actions: ActionCredentials = credentialTypes.reduce((acc, type) => (acc[type] = [], acc), {});
    credentials.forEach(pc => {
        actions[pc.credential.template.name].push({
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
