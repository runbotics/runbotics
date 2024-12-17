import { ACTION_GROUP, ActionCredentialType } from 'runbotics-common';

const ACTION_ID_TO_CREDENTIAL_TYPE = {
    [ACTION_GROUP.ASANA]: ActionCredentialType.ASANA,
    [ACTION_GROUP.GOOGLE]: ActionCredentialType.GOOGLE,
    [ACTION_GROUP.JIRA]: ActionCredentialType.ATLASSIAN,
    [ACTION_GROUP.JIRA_CLOUD]: ActionCredentialType.ATLASSIAN,
    [ACTION_GROUP.JIRA_SERVER]: ActionCredentialType.ATLASSIAN,
    [ACTION_GROUP.SAP]: ActionCredentialType.SAP,
    [ACTION_GROUP.MAIL]: ActionCredentialType.EMAIL,
    [ACTION_GROUP.BEEOFFICE]: ActionCredentialType.BEE_OFFICE,
    [ACTION_GROUP.CLOUD_EXCEL]: ActionCredentialType.MICROSOFT_GRAPH,
    [ACTION_GROUP.CLOUD_FILE]: ActionCredentialType.MICROSOFT_GRAPH,
};

export const getCredentialTypeFromActionGroup = (actionGroup: string) => {
    const credentialType = ACTION_ID_TO_CREDENTIAL_TYPE[actionGroup];
    if (!credentialType) {
        // eslint-disable-next-line no-console
        console.error(`[getCredentialTypeFromActionGroup] No credential type found for actionId: ${actionGroup}`);
    }
    return credentialType;
};


