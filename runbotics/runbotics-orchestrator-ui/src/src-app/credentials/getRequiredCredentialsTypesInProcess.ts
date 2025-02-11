import { IProcess, ActionCredentialType } from 'runbotics-common';

import { IBpmnAction } from '#src-app/Actions/types';

const ACTION_ID_REGEX = /camunda:actionId="([a-zA-Z_.]+)"/g;

export const getRequiredCredentialsTypesInProcess = (definition: IProcess['definition'], actions: Record<string, IBpmnAction>): ActionCredentialType[] =>
    [
        ...Array.from(definition.matchAll(ACTION_ID_REGEX), m => m[1])
            .reduce((set, actionId) =>
                actions[actionId]?.credentialType
                    ? set.add(actions[actionId].credentialType as ActionCredentialType) : set
            , new Set<ActionCredentialType>())
    ];
