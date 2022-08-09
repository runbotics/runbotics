import { Activity } from 'bpmn-elements';

export default function LoopSubProcess(activityDefinition, context) {
    return Activity(LoopSubProcessBehaviour, activityDefinition, context);
}

export function LoopSubProcessBehaviour(activity, context) {
    const { id, type, broker } = activity;
    const { environment } = context;

    const event = {
        execute,
    };

    return event;

    function execute(executeMessage) {
        const content = executeMessage.content;

        // environment.services.getSomeData({id, type}, (err, result) => {
        //     if (err) return broker.publish('execution', 'execute.error', {...content, error: err});
        //
        //     return broker.publish('execution', 'execute.completed', {...content, result});
        // });
    }
}
