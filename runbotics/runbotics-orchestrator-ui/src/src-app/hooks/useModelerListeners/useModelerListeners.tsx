import { Dispatch, SetStateAction } from 'react';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

import internalBpmnActions from '#src-app/Actions';
import { useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import { ProcessBuildTab } from '#src-app/types/sidebar';
import getElementLabel from '#src-app/utils/getElementLabel';

import {
    applyModelerElement,
    toggleValidationError,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementManipulation';

import { CommandStackEvent, EventBusEvent } from './useModelerListeners.types';
import { isValidElement } from './useModelerListeners.validation';

const ELEMENTS_PROPERTIES_WHITELIST = [
    'bpmn:ServiceTask',
    'bpmn:SequenceFlow',
    'bpmn:SubProcess',
];
interface useModelerListenersProps {
    setCurrentTab: Dispatch<SetStateAction<ProcessBuildTab>>;
}

const useModelerListeners = ({ setCurrentTab }: useModelerListenersProps) => {
    const dispatch = useDispatch();
    const externalBpmnActions = useSelector(
        (state) => state.action.bpmnActions.byId
    );
    const handleInvalidElement = ({ element, modeler, errorType }) => {
        dispatch(
            processActions.setError({
                elementId: element.id,
                elementName: getElementLabel(element),
                type: errorType,
            })
        );

        if (!element.businessObject.validationError) {
            toggleValidationError(modeler, element, true);
        }
    };

    const handleValidElement = ({ element, modeler }) => {
        dispatch(processActions.removeError(element.id));

        if (element.businessObject.validationError) {
            toggleValidationError(modeler, element, false);
        }
    };

    const modelerListeners = (modeler: BpmnModeler) => ({
        'commandStack.changed': () => {
            const { _stackIdx, _stack } = modeler.get('commandStack');
            dispatch(
                processActions.setCommandStack({
                    commandStackIdx: _stackIdx,
                    commandStackSize: _stack.length,
                })
            );
        },
        'commandStack.shape.delete.preExecute': () => {
            dispatch(processActions.resetSelection());
        },
        'commandStack.connection.delete.preExecute': () => {
            dispatch(processActions.resetSelection());
        },
        'commandStack.connection.delete.postExecuted': (
            event: CommandStackEvent
        ) => {
            const { source, target } = event.context;

            isValidElement({
                element: source,
                handleInvalidElement,
                handleValidElement,
                modeler: modeler,
            });
            isValidElement({
                element: target,
                handleInvalidElement,
                handleValidElement,
                modeler: modeler,
            });
        },
        'commandStack.connection.create.postExecuted': (
            event: CommandStackEvent
        ) => {
            const { source, target } = event.context;
            isValidElement({
                element: source,
                handleInvalidElement,
                handleValidElement,
                modeler: modeler,
            });
            isValidElement({
                element: target,
                handleInvalidElement,
                handleValidElement,
                modeler: modeler,
            });
        },
        'commandStack.elements.create.postExecuted': (
            event: CommandStackEvent
        ) => {
            const { elements } = event.context;
            elements.forEach((element) => {
                dispatch(processActions.setSelectedElement(element));
                dispatch(processActions.setSelectedAction(null));
                const externalAction = _.cloneDeep(
                    externalBpmnActions[element?.businessObject.actionId]
                );
                const action =
                    externalAction ??
                    internalBpmnActions[element?.businessObject.actionId];
                applyModelerElement({
                    modeler,
                    element,
                    action,
                });
                if (element.id.includes('Activity')) {
                    dispatch(processActions.addAppliedAction(element.id));
                }
            });
        },
        'connection.removed': () => {
            setCurrentTab(null);
        },
        'element.click': (event: EventBusEvent) => {
            if (ELEMENTS_PROPERTIES_WHITELIST.includes(event.element.type)) {
                dispatch(processActions.setSelectedElement(event.element));
            } else {
                setCurrentTab(null);
                dispatch(processActions.resetSelection());
            }
        },
        'shape.removed': (event: EventBusEvent) => {
            setCurrentTab(null);
            dispatch(processActions.removeAppliedAction(event.element.id));
            dispatch(processActions.removeError(event.element.id));
        },
        'shape.changed': (event: EventBusEvent) => {
            isValidElement({
                element: event.element,
                handleInvalidElement,
                handleValidElement,
                modeler: modeler,
            });
        },
    });

    return {
        modelerListeners,
    };
};

export default useModelerListeners;
