import { IProcess, ActionCredentialType } from 'runbotics-common';

import actions from '#src-app/Actions';

const ACTION_ID_REGEX = /camunda:actionId="([a-zA-Z.]+)"/g;

export const getRequiredCredentialsTypesInProcess = (definition: IProcess['definition']): ActionCredentialType[] =>
    [
        ...Array.from(definition.matchAll(ACTION_ID_REGEX), m => m[1])
            .reduce((set, actionId) =>
                actions[actionId]?.credentialType
                    ? set.add(actions[actionId].credentialType) : set
            , new Set<ActionCredentialType>())
    ];
