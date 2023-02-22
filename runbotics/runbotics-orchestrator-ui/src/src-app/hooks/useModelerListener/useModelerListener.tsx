/* eslint-disable no-console */
import BpmnModeler from 'bpmn-js/lib/Modeler';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

import { BpmnElementType } from 'runbotics-common';

import internalBpmnActions from '#src-app/Actions';
import { useSelector } from '#src-app/store';
import { processActions } from '#src-app/store/slices/Process';
import getElementLabel from '#src-app/utils/getElementLabel';

import { ModelerEvent } from '#src-app/views/process/ProcessBuildView/Modeler/BpmnModeler/BpmnModeler.types';
import {
    applyModelerElement,
    toggleValidationError,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementManipulation';

import useTranslations from '../useTranslations';
import {
    CommandStackEvent,
    EventBusEvent,
    ModelerListenerHookProps,
} from './useModelerListener.types';
import {
    getModelerActivities,
    validateElement,
    validateStartEvent,
} from './useModelerListener.validation';

const ELEMENTS_PROPERTIES_WHITELIST = [
    BpmnElementType.SERVICE_TASK,
    BpmnElementType.SEQUENCE_FLOW,
    BpmnElementType.SUBPROCESS,
];

// eslint-disable-next-line max-lines-per-function
const useModelerListener = ({ setCurrentTab }: ModelerListenerHookProps) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const externalBpmnActions = useSelector(
        (state) => state.action.bpmnActions.byId
    );

    const handleInvalidStartEvent = ({
        element,
        modeler,
        errorType,
        nameKey,
    }) => {
        dispatch(
            processActions.setError({
                elementId: element.parent.id,
                elementName: nameKey
                    ? translate(nameKey)
                    : getElementLabel(element),
                type: errorType,
            })
        );

        if (!element.businessObject.validationError) {
            toggleValidationError(modeler, element, true);
        }
    };

    const handleInvalidElement = ({ element, modeler, errorType}) => {
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
        [ModelerEvent.COMMANDSTACK_SHAPE_CREATE_POSTEXECUTED]: (
            event: CommandStackEvent
        ) => {
            if (event?.context.shape.type === BpmnElementType.START_EVENT) {
                validateStartEvent({
                    modeler,
                    context: event.context,
                    handleInvalidElement: handleInvalidStartEvent,
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
                console.log(Object.values(_elements).reduce((acc: any, prev: any) => {
                    if(prev.element.type === BpmnElementType.START_EVENT){
                        return [...acc, prev.element];
                    }
                    return acc;
                }, []));
                //to do on undo and redo
                dispatch(
                    processActions.setAppliedActions(
                        getModelerActivities(_elements)
                    )
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
        [ModelerEvent.COMMANDSTACK_CONNECTION_CREATE_POSTEXECUTED]: (
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
        [ModelerEvent.CONNECTION_REMOVED]: () => {
            setCurrentTab(null);
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
        },
        [ModelerEvent.SHAPE_CHANGED]: (event: EventBusEvent) => {
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

export default useModelerListener;
