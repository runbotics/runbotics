import { Activity } from 'bpmn-elements';
import { SubProcess } from 'bpmn-elements';
// import { SubProcessBehaviour } from './ExtendedBpmnEngine';
import { SubProcessBehaviour } from 'bpmn-elements/src/tasks/SubProcess';
// import { Activity } from 'bpmn-elements/src/activity/Activity';

export default function LoopSubProcess(activityDef, context) {
    console.log('DL TEST - LoopSubProcess started');
    //todo here should be SubProcessBehaviour
    return new Activity(LoopSubProcessBehaviour, activityDef, context);
}

export function LoopSubProcessBehaviour(activity, context) {
    this.activity = activity;
    this.context = context;
}

LoopSubProcessBehaviour.prototype.execute = function execute(executeMessage) {
    console.log('DL TEST - LoopSubProcessBehaviour.execute overwrited.')
    const content = executeMessage.content;
    const {id, type, broker} = this.activity;
    const {environment} = this.context;

    environment.services.getSomeData({id, type}, (err, result) => {
        if (err) return broker.publish('execution', 'execute.error', {...content, error: err});
        return broker.publish('execution', 'execute.completed', {...content, result});
    });
};
