import BpmnModeler from 'bpmn-js/lib/Modeler';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

import { BpmnElementType } from 'runbotics-common';

import internalBpmnActions from '#src-app/Actions';
import store, { useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import getElementLabel from '#src-app/utils/getElementLabel';

import { getActivityById } from '#src-app/views/process/ProcessBuildView/Modeler/BpmnModeler';
import { ModelerEvent } from '#src-app/views/process/ProcessBuildView/Modeler/BpmnModeler/BpmnModeler.types';
import {
    applyModelerElement,
    toggleValidationError,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementManipulation';

import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import {
    CommandStackEvent,
    EventBusEvent,
    ModelerListenerHookProps,
} from './useModelerListener.types';
import {
    getModelerActivities,
    getModelerActivitiesElementsWithOutput,
    validateElement,
    validateStartEvents,
    validateAllConnections,
} from './useModelerListener.validation';
import useTranslations from '../useTranslations';

const ELEMENTS_PROPERTIES_WHITELIST = [
    BpmnElementType.SERVICE_TASK,
    BpmnElementType.SEQUENCE_FLOW,
    BpmnElementType.SUBPROCESS,
    BpmnElementType.EXCLUSIVE_GATEWAY,
];

// eslint-disable-next-line max-lines-per-function
const useModelerListener = ({ setCurrentTab }: ModelerListenerHookProps) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const externalBpmnActions = useSelector(
        (state) => state.action.bpmnActions.byId
    );
    const { pluginBpmnActions } = useSelector((state) => state.plugin);

    const handleInvalidStartEvent = ({ errorType, nameKey, elementId }) => {
        dispatch(
            processActions.setError({
                elementId,
                elementName: translate(nameKey),
                type: errorType,
            })
        );
    };

    const handleValidStartEvent = ({ elementId }) => {
        dispatch(processActions.removeError(elementId));
    };

    const handleInvalidShape = ({
        element,
        modeler,
        errorType,
        nameKey,
        relatedElements,
    }) => {
        dispatch(
            processActions.setError({
                elementId: element.id,
                elementName: nameKey
                    ? translate(nameKey)
                    : getElementLabel(element),
                type: errorType,
                relatedElements: relatedElements ?? [],
            })
        );

        if (!element.businessObject.validationError) {
            toggleValidationError(modeler, element, true);
        }
    };

    const handleValidShape = ({ element, modeler }) => {
        dispatch(processActions.removeError(element.id));

        if (element.businessObject.validationError) {
            toggleValidationError(modeler, element, false);
        }
    };

    const validateUnknownElement = (
        elements: Record<string, { element: BPMNElement }>,
        modeler: BpmnModeler
    ) => {
        validateStartEvents({
            handleValidElement: handleValidStartEvent,
            handleInvalidElement: handleInvalidStartEvent,
            modeler,
        });
        Object.values(elements).forEach(({ element }) => {
            validateElement({
                element: element,
                handleInvalidElement: handleInvalidShape,
                handleValidElement: handleValidShape,
                modeler,
            });
        });
    };

    // eslint-disable-next-line max-lines-per-function
    const modelerListener = (modeler: BpmnModeler) => ({
        [ModelerEvent.COMMANDSTACK_SHAPE_CREATE_POSTEXECUTED]: (
            event: CommandStackEvent
        ) => {
            if (event?.context.shape.type === BpmnElementType.START_EVENT) {
                validateStartEvents({
                    handleInvalidElement: handleInvalidStartEvent,
                    handleValidElement: handleValidStartEvent,
                    modeler,
                });
            }
        },
        [ModelerEvent.COMMANDSTACK_CHANGED]: (event: CommandStackEvent) => {
            const { _stackIdx, _stack } = modeler.get('commandStack');
            dispatch(
                processActions.setCommandStack({
                    commandStackIdx: _stackIdx,
                    commandStackSize: _stack.length,
                })
            );
            if (event.trigger === 'redo' || event.trigger === 'undo') {
                const { _elements } = modeler.get('elementRegistry');

                validateStartEvents({
                    handleValidElement: handleValidStartEvent,
                    handleInvalidElement: handleInvalidStartEvent,
                    modeler,
                });

                dispatch(
                    processActions.setAppliedActions(
                        getModelerActivities(_elements)
                    )
                );
            }
            if (event.trigger === 'execute') {
                validateAllConnections(
                    modeler,
                    handleInvalidShape,
                    handleValidShape
                );
            }
        },
        [ModelerEvent.COMMANDSTACK_SHAPE_DELETE_PREEXECUTE]: (
            event: CommandStackEvent
        ) => {
            if (event?.context.shape.type === BpmnElementType.START_EVENT) {
                dispatch(
                    processActions.removeError(event.context.shape.parent.id)
                );
            }
            dispatch(processActions.resetSelection());
        },
        [ModelerEvent.COMMANDSTACK_CONNECTION_DELETE_PREEXECUTE]: () => {
            dispatch(processActions.resetSelection());
        },
        [ModelerEvent.COMMANDSTACK_CONNECTION_DELETE_POSTEXECUTED]: (
            event: CommandStackEvent
        ) => {
            validateAllConnections(
                modeler,
                handleInvalidShape,
                handleValidShape
            );
        },
        [ModelerEvent.COMMANDSTACK_CONNECTION_CREATE_POSTEXECUTED]: (
            event: CommandStackEvent
        ) => {
            validateAllConnections(
                modeler,
                handleInvalidShape,
                handleValidShape
            );
        },
        [ModelerEvent.COMMANDSTACK_ELEMENTS_CREATE_POSTEXECUTED]: (
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
                    externalAction ||
                    internalBpmnActions[element?.businessObject.actionId] ||
                    pluginBpmnActions[element?.businessObject.actionId];
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
        [ModelerEvent.CONNECTION_REMOVED]: (event: EventBusEvent) => {
            dispatch(processActions.removeError(event.element.id));
            dispatch(
                processActions.removeCustomValidationError(event.element.id)
            );
            setCurrentTab(null);
        },
        [ModelerEvent.IMPORT_DONE]: () => {
            const { _elements } = modeler.get('elementRegistry');
            const activitiesWithOutput =
                getModelerActivitiesElementsWithOutput(_elements);
            Object.values(activitiesWithOutput).forEach(({ element }) => {
                if (element.businessObject.processOutput) {
                    dispatch(
                        processActions.setCurrentProcessOutputElement(element)
                    );
                }
            });
        },
        [ModelerEvent.ELEMENT_CLICK]: (event: EventBusEvent) => {
            if (ELEMENTS_PROPERTIES_WHITELIST.includes(event.element.type)) {
                dispatch(processActions.setSelectedElement(event.element));
            } else {
                setCurrentTab(null);
                dispatch(processActions.resetSelection());
            }
        },
        [ModelerEvent.SHAPE_REMOVED]: (event: EventBusEvent) => {
            setCurrentTab(null);
            dispatch(processActions.removeAppliedAction(event.element.id));
            dispatch(processActions.removeError(event.element.id));
            dispatch(
                processActions.removeCustomValidationError(event.element.id)
            );
            const relatedError = store
                .getState()
                .process.modeler.errors.find((error) =>
                    error.relatedElements?.includes(event.element.id)
                );
            if (relatedError) {
                const elementToValidate = getActivityById(
                    modeler,
                    relatedError.elementId
                );
                validateElement({
                    element: elementToValidate,
                    handleInvalidElement: handleInvalidShape,
                    handleValidElement: handleValidShape,
                    modeler,
                });
            }
        },
        [ModelerEvent.SHAPE_CHANGED]: (event: EventBusEvent) => {
            validateElement({
                element: event.element,
                handleInvalidElement: handleInvalidShape,
                handleValidElement: handleValidShape,
                modeler,
            });
        },
        [ModelerEvent.DRAG_INIT]: () => {
            dispatch(processActions.setActiveDrag(true));
        },
        [ModelerEvent.DRAG_CLEANUP]: () => {
            dispatch(processActions.setActiveDrag(false));
        },
    });

    return {
        modelerListener,
        validateUnknownElement,
    };
};

export default useModelerListener;
