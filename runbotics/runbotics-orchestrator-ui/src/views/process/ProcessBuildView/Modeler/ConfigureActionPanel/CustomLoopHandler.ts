import _ from 'lodash';
import { ActionListPanelProps } from '../ActionListPanel';
import internalBpmnActions from './Actions';
import { ActionToBPMNElement, TaskType } from './ActionToBPMNElement';

const customLoopHandler: Record<string, (event: any, props: ActionListPanelProps) => void> = {
    'loop.loop': (event: any, props: ActionListPanelProps) => {
        const actionToBPMNElement = ActionToBPMNElement.from(props.modeler);

        const loopCardinality = props.modeler.get('bpmnFactory').create('bpmn:Expression');
        loopCardinality.body = '1';

        const multiInstanceLoopCharacteristics = props.modeler
            .get('bpmnFactory')
            .create('bpmn:MultiInstanceLoopCharacteristics', {
                isSequential: true,
                collection: '',
                elementVariable: '',
                loopCardinality,
            });

        const initLoopConfiguration = actionToBPMNElement.createElement(
            TaskType.SubProcess,
            _.cloneDeep(internalBpmnActions['loop.loop']),
            {
                loopCharacteristics: multiInstanceLoopCharacteristics,
            },
            {
                isExpanded: true,
            },
        );

        props.modeler.get('create').start(event, [initLoopConfiguration]);
    },
};
export default customLoopHandler;
