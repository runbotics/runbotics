import ProcessExecution from 'bpmn-elements/dist/src/process/ProcessExecution';
import Activity from 'bpmn-elements/dist/src/activity/Activity';
import { cloneContent } from 'bpmn-elements/dist/src/messageHelper';

// This is copy of SubProcess/SubProcessBehaviour from bpmn-elements library.
// Purpose of these functions is to save output variables after every iteration of the sub process in main process.
// Only addListeners method has been modified and it is calling method setLoopVariablesInProcess.

export default function LoopSubProcess(activityDef, context) {
    const triggeredByEvent = activityDef.behaviour && activityDef.behaviour.triggeredByEvent;

    const subProcess = Activity(LoopSubProcessBehaviour, {...activityDef, isSubProcess: true, triggeredByEvent}, context);

    subProcess.getStartActivities = function getStartActivities(filterOptions) {
        return context.getStartActivities(filterOptions, activityDef.id);
    };

    subProcess.broker.cancel('_api-shake');
    subProcess.broker.subscribeTmp('api', 'activity.shake.*', onShake, {noAck: true, consumerTag: '_api-shake'});

    return subProcess;

    function onShake(_, message) {
        const {startId} = message.content;
        const last = message.content.sequence.pop();
        const sequence = ProcessExecution(subProcess, context).shake(startId);
        message.content.sequence.push({...last, isSubProcess: true, sequence});
    }
}

export function LoopSubProcessBehaviour(activity, context) {
    const {id, type, broker, behaviour, environment, logger} = activity;
    const loopCharacteristics = behaviour.loopCharacteristics && behaviour.loopCharacteristics.Behaviour(activity, behaviour.loopCharacteristics);

    const processExecutions = [];
    let rootExecutionId;

    const source = {
        id,
        type,
        loopCharacteristics,
        get execution() {
            return processExecutions[0];
        },
        get executions() {
            return processExecutions;
        },
        execute,
        getApi,
        getState,
        getPostponed() {
            return this.executions.reduce((result, pe) => {
                result = result.concat(pe.getPostponed());
                return result;
            }, []);
        },
        recover,
    };

    return source;

    function execute(executeMessage) {
        const content = executeMessage.content;

        if (content.isRootScope) {
            rootExecutionId = content.executionId;
        }

        if (loopCharacteristics && content.isRootScope) {
            broker.subscribeTmp('api', `activity.#.${rootExecutionId}`, onApiRootMessage, {noAck: true, consumerTag: `_api-${rootExecutionId}`, priority: 200});
            return loopCharacteristics.execute(executeMessage);
        }

        const processExecution = upsertExecution(executeMessage);
        if (!processExecution) return;

        return processExecution.execute(executeMessage);

        function onApiRootMessage(routingKey, message) {
            const messageType = message.properties.type;

            switch (messageType) {
                case 'stop':
                    broker.cancel(`_api-${rootExecutionId}`);
                    stop();
                    break;
                case 'discard':
                    broker.cancel(`_api-${rootExecutionId}`);
                    discard();
                    break;
            }
        }
    }

    function stop() {
        return processExecutions.forEach((pe) => {
            broker.cancel(`_sub-process-execution-${pe.executionId}`);
            broker.cancel(`_sub-process-api-${pe.executionId}`);
            pe.stop();
        });
    }

    function discard() {
        return processExecutions.forEach((pe) => {
            broker.cancel(`_sub-process-execution-${pe.executionId}`);
            broker.cancel(`_sub-process-api-${pe.executionId}`);
            pe.discard();
        });
    }

    function getState() {
        if (loopCharacteristics) {
            return {
                executions: processExecutions.map(getExecutionState),
            };
        }

        if (processExecutions.length) {
            return getExecutionState(processExecutions[0]);
        }

        function getExecutionState(pe) {
            const state = pe.getState();
            state.environment = pe.environment.getState();
            return state;
        }
    }

    function recover(state) {
        if (!state) return;

        if (loopCharacteristics && state.executions) {
            processExecutions.splice(0);
            return state.executions.forEach(recover);
        } else if (!loopCharacteristics) {
            processExecutions.splice(0);
        }

        const subEnvironment = environment.clone().recover(state.environment);
        const subContext = context.clone(subEnvironment);

        const execution = ProcessExecution(activity, subContext).recover(state);

        processExecutions.push(execution);
        return execution;
    }

    function upsertExecution(executeMessage) {
        const content = executeMessage.content;
        const executionId = content.executionId;

        let execution = getExecutionById(executionId);
        if (execution) {
            if (executeMessage.fields.redelivered) addListeners(execution, executionId);
            return execution;
        }

        const subEnvironment = environment.clone({ output: {} });
        const subContext = context.clone(subEnvironment);

        execution = ProcessExecution(activity, subContext);
        processExecutions.push(execution);

        addListeners(execution, executionId);

        return execution;
    }

    function addListeners(processExecution, executionId) {
        const executionConsumerTag = `_sub-process-execution-${executionId}`;

        broker.subscribeTmp('subprocess-execution', `execution.#.${executionId}`, onExecutionCompleted, {noAck: true, consumerTag: executionConsumerTag});

        function onExecutionCompleted(_, message) {
            const content = message.content;
            const messageType = message.properties.type;

            if (message.fields.redelivered && message.properties.persistent === false) return;

            switch (messageType) {
                case 'stopped': {
                    broker.cancel(executionConsumerTag);
                    removeExecutionById(executionId);
                    break;
                }
                case 'discard': {
                    broker.cancel(executionConsumerTag);
                    broker.publish('execution', 'execute.discard', cloneContent(content));
                    removeExecutionById(executionId);
                    break;
                }
                case 'completed': {
                    setLoopVariablesInProcess(content);
                    broker.cancel(executionConsumerTag);
                    broker.publish('execution', 'execute.completed', cloneContent(content));
                    removeExecutionById(executionId);
                    break;
                }
                case 'error': {
                    broker.cancel(executionConsumerTag);

                    const {error} = content;
                    logger.error(`<${id}>`, error);
                    broker.publish('execution', 'execute.error', cloneContent(content));
                    removeExecutionById(executionId);
                    break;
                }
            }
        }

        function setLoopVariablesInProcess(content) {
            Object.entries(content.output).forEach(([key, value]) => {
                if (key !== 'variableName') {
                    environment.variables[key] = value;
                }
            });
        }
    }

    function getApi(apiMessage) {
        const content = apiMessage.content;

        if (content.id === id) return;

        let execution;
        if ((execution = getExecutionById(content.parent.executionId))) {
            return execution.getApi(apiMessage);
        }

        const parentPath = content.parent.path;

        for (let i = 0; i < parentPath.length; i++) {
            if ((execution = getExecutionById(parentPath[i].executionId))) return execution.getApi(apiMessage);
        }
    }

    function getExecutionById(executionId) {
        return processExecutions.find((pe) => pe.executionId === executionId);
    }

    function removeExecutionById(executionId) {
        const index = processExecutions.findIndex((pe) => pe.executionId === executionId);
        if (index !== -1) {
            processExecutions.splice(index, 1);
        }
    }
}
