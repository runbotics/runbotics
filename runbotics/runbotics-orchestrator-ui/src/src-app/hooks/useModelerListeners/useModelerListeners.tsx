import BpmnModeler from 'bpmn-js/lib/Modeler';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

import { BpmnElementType } from 'runbotics-common';

import internalBpmnActions from '#src-app/Actions';
import { useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import getElementLabel from '#src-app/utils/getElementLabel';

import { ModelerEvents } from '#src-app/views/process/ProcessBuildView/Modeler/BpmnModeler/BpmnModeler.types';
import {
    applyModelerElement,
    toggleValidationError,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementManipulation';

import {
    CommandStackEvent,
    EventBusEvent,
    ModelerListenersProps,
} from './useModelerListeners.types';
import {
    getModelerActivities,
    validateElement,
} from './useModelerListeners.validation';

const ELEMENTS_PROPERTIES_WHITELIST = [
    BpmnElementType.SERVICE_TASK,
    BpmnElementType.SEQUENCE_FLOW,
    BpmnElementType.SUBPROCESS,
];

const useModelerListeners = ({ setCurrentTab }: ModelerListenersProps) => {
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

    const modelerListener = (modeler: BpmnModeler) => ({
        [ModelerEvents.COMMANDSTACK_CHANGED]: (e: CommandStackEvent) => {
            const { _stackIdx, _stack } = modeler.get('commandStack');
            dispatch(
                processActions.setCommandStack({
                    commandStackIdx: _stackIdx,
                    commandStackSize: _stack.length,
                })
            );
            if (e.trigger === 'redo' || e.trigger === 'undo') {
                const { _elements } = modeler.get('elementRegistry');
                dispatch(
                    processActions.setAppliedActions(
                        getModelerActivities(_elements)
                    )
                );
            }
        },
        [ModelerEvents.COMMANDSTACK_SHAPE_DELETE_PREEXECUTE]: () => {
            dispatch(processActions.resetSelection());
        },
        [ModelerEvents.COMMANDSTACK_CONNECTION_DELETE_PREEXECUTE]: () => {
            dispatch(processActions.resetSelection());
        },
        [ModelerEvents.COMMANDSTACK_CONNECTION_DELETE_POSTEXECUTED]: (
            event: CommandStackEvent
        ) => {
            const { source, target } = event.context;

            validateElement({
                element: source,
                handleInvalidElement,
                handleValidElement,
                modeler,
            });
            validateElement({
                element: target,
                handleInvalidElement,
                handleValidElement,
                modeler,
            });
        },
        [ModelerEvents.COMMANDSTACK_CONNECTION_CREATE_POSTEXECUTED]: (
            event: CommandStackEvent
        ) => {
            const { source, target } = event.context;
            validateElement({
                element: source,
                handleInvalidElement,
                handleValidElement,
                modeler,
            });
            validateElement({
                element: target,
                handleInvalidElement,
                handleValidElement,
                modeler,
            });
        },
        [ModelerEvents.COMMANDSTACK_ELEMENTS_CREATE_POSTEXECUTED]: (
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
        [ModelerEvents.CONNECTION_REMOVED]: () => {
            setCurrentTab(null);
        },
        [ModelerEvents.ELEMENT_CLICK]: (event: EventBusEvent) => {
            if (ELEMENTS_PROPERTIES_WHITELIST.includes(event.element.type)) {
                dispatch(processActions.setSelectedElement(event.element));
            } else {
                setCurrentTab(null);
                dispatch(processActions.resetSelection());
            }
        },
        [ModelerEvents.SHAPE_REMOVED]: (event: EventBusEvent) => {
            setCurrentTab(null);
            dispatch(processActions.removeAppliedAction(event.element.id));
            dispatch(processActions.removeError(event.element.id));
        },
        [ModelerEvents.SHAPE_CHANGED]: (event: EventBusEvent) => {
            validateElement({
                element: event.element,
                handleInvalidElement,
                handleValidElement,
                modeler,
            });
        },
    });

    return {
        modelerListener,
    };
};

export default useModelerListeners;
