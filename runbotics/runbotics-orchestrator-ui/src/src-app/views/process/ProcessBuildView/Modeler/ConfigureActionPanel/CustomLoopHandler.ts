import BpmnIoModeler from 'bpmn-js/lib/Modeler';
import _ from 'lodash';

import internalBpmnActions from './Actions';
import { ActionToBPMNElement, TaskType } from './ActionToBPMNElement';

const customLoopHandler: Record<
    string,
    (event: any, modeler: BpmnIoModeler) => void
> = {
    'loop.loop': (event: any, modeler: BpmnIoModeler) => {
        const actionToBPMNElement = ActionToBPMNElement.from(modeler);

        const loopCardinality = modeler
            .get('bpmnFactory')
            .create('bpmn:Expression');
        loopCardinality.body = '1';

        const multiInstanceLoopCharacteristics = modeler
            .get('bpmnFactory')
            .create('bpmn:MultiInstanceLoopCharacteristics', {
                isSequential: true,
                collection: '',
                elementVariable: '',
                loopCardinality
            });

        const initLoopConfiguration = actionToBPMNElement.createElement(
            TaskType.SubProcess,
            _.cloneDeep(internalBpmnActions['loop.loop']),
            {
                loopCharacteristics: multiInstanceLoopCharacteristics
            },
            {
                isExpanded: true
            }
        );

        modeler.get('create').start(event, [initLoopConfiguration]);
    }
};
export default customLoopHandler;
