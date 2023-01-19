import { ProcessInstanceStatus } from 'runbotics-common';
import { StatefulActionHandler } from 'runbotics-sdk';

export const FINISHED_PROCESS_STATUSES = [
    ProcessInstanceStatus.COMPLETED,
    ProcessInstanceStatus.STOPPED,
    ProcessInstanceStatus.ERRORED,
];

export const STATEFUL_ACTION_HANDLER = 'StatefulActionHandler';

const ACTIONS_PATH = '../../../action';

// export const dynamicHandlers: DynamicHandlers = {
//     sap: {
//         clazz: `${ACTIONS_PATH}/sap/SAPAutomation`, // TODO
//         type: 'internal',
//         instance: undefined,
//     },
//     application: {
//         clazz: `${ACTIONS_PATH}/application/ApplicationAutomation`,
//         type: 'internal',
//         instance: undefined,
//     },
//     google: {
//         clazz: `${ACTIONS_PATH}/google/GoogleActionHandler`,
//         type: 'internal',
//         instance: undefined,
//     },
//     browser: {
//         clazz: `${ACTIONS_PATH}/browser/BrowserAutomation`,
//         type: 'internal',
//         instance: undefined,
//     },
//     javascript: {
//         clazz: `${ACTIONS_PATH}/rce/JavaScriptActionHandler`,
//         type: 'internal',
//         instance: undefined,
//     },
//     typescript: {
//         clazz: `${ACTIONS_PATH}/rce/JavaScriptActionHandler`,
//         type: 'internal',
//         instance: undefined,
//     },
//     asana: {
//         clazz: `${ACTIONS_PATH}/asana/AsanaActionHandler`,
//         type: 'internal',
//         instance: undefined,
//     },
// };

export const isStatefulActionHandler = (
    handlerInstance: unknown
): handlerInstance is StatefulActionHandler => handlerInstance
    && typeof handlerInstance === 'object';
    // && handlerInstance.getType
    // && handlerInstance.getType() === STATEFUL_ACTION_HANDLER;