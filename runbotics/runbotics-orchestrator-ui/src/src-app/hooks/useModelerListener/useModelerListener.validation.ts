import Ajv from 'ajv';
import _ from 'lodash';

import { BpmnElementType } from 'runbotics-common';

import { ModelerErrorType } from '#src-app/store/slices/Process';
import {
    getFormData,
    getFormSchema,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementForm';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import {
    ModelerSyncParams,
    RootEventMap,
    ValidateElementProps,
    ValidateStartEventsProps,
} from './useModelerListener.types';

export const getModelerActivities = (elements: BPMNElement[]) =>
    _.sortBy(
        Object.keys(elements)?.filter((elm) => elm.startsWith('Activity'))
    );

export const isModelerSync = ({
    modeler,
    appliedActivities,
    imported,
    commandStack,
    errors,
}: ModelerSyncParams) => {
    if (!modeler) return false;
    const { _elements } = modeler.get('elementRegistry');
    const modelerActivities = getModelerActivities(_elements);
    const areActivitiesMatched = _.isEqual(
        _.sortBy(modelerActivities),
        _.sortBy(appliedActivities)
    );

    return (
        imported ||
        (areActivitiesMatched &&
            commandStack.commandStackIdx >= 0 &&
            errors.length === 0)
    );
};

const ajv = new Ajv({
    formats: {
        variableName: 'string',
    },
});

const validateForm = (element: BPMNElement) => {
    const formData = getFormData(element);
    const validate = ajv.compile(getFormSchema(element));
    return { isValid: validate(formData), formData };
};
// eslint-disable-next-line complexity
const validateConnections = (element: BPMNElement) => {
    const incomingConnections = element.incoming.filter(
        (flow) => flow.type === BpmnElementType.SEQUENCE_FLOW
    );
    const outgoingConnections = element.outgoing.filter(
        (flow) => flow.type === BpmnElementType.SEQUENCE_FLOW
    );
    const hasOutgoingConnection = outgoingConnections.length >= 1;

    const hasIncomingConnection = incomingConnections.length >= 1;

    const isStartEventWithoutOutgoingConnection =
        element.type === BpmnElementType.START_EVENT && !hasOutgoingConnection;

    const isEndEventWithoutIncomingConnection =
        element.type === BpmnElementType.END_EVENT && !hasIncomingConnection;

    const isExclusiveGatewayWithoutConnections =
        element.type === BpmnElementType.EXCLUSIVE_GATEWAY &&
        (!hasIncomingConnection || !hasOutgoingConnection);

    const isServiceTaskWithoutConnections =
        element.type === BpmnElementType.SERVICE_TASK &&
        (!hasIncomingConnection || !hasOutgoingConnection);

    const isSubprocessWithoutConnections =
        element.type === BpmnElementType.SUBPROCESS &&
        (!hasIncomingConnection || !hasOutgoingConnection);

    if (
        isStartEventWithoutOutgoingConnection ||
        isEndEventWithoutIncomingConnection ||
        isExclusiveGatewayWithoutConnections ||
        isServiceTaskWithoutConnections ||
        isSubprocessWithoutConnections
    ) {
        return false;
    }

    return true;
};

// eslint-disable-next-line complexity
export const validateElement = ({
    element,
    handleInvalidElement,
    handleValidElement,
    modeler,
}: ValidateElementProps) => {
    const isConnectionValid = validateConnections(element);
    if (element.id.includes('Activity') === false) {
        if (!isConnectionValid) {
            const formattedType =
                element.type[0].toUpperCase() +
                element.type.replace(':', '-').slice(1);

            handleInvalidElement({
                element,
                modeler,
                errorType: ModelerErrorType.CONNECTION_ERROR,
                nameKey: `Process.Details.Modeler.Actions.${formattedType}.Label`,
            });
        } else {
            handleValidElement({
                element,
                modeler,
            });
        }
        return;
    }

    const { isValid: isFormValid, formData } = validateForm(element);

    if (!isFormValid && !formData.disabled) {
        handleInvalidElement({
            element,
            modeler,
            errorType: ModelerErrorType.FORM_ERROR,
        });
        return;
    }

    if (!isConnectionValid && !formData.disabled) {
        handleInvalidElement({
            element,
            modeler,
            errorType: ModelerErrorType.CONNECTION_ERROR,
        });
        return;
    }

    handleValidElement({ element, modeler });
};

export const validateStartEvents = ({
    handleInvalidElement,
    handleValidElement,
    modeler,
}: ValidateStartEventsProps) => {
    const { _elements } = modeler.get('elementRegistry');
    // this checks if inside root components (eg: subprocess, main canvas) is only one start event
    const rootEventMap = Object.values(_elements).reduce(
        (acc: RootEventMap, prev: { element: BPMNElement }) => {
            if (prev.element.type === BpmnElementType.START_EVENT) {
                const id = prev.element.parent?.id;
                return { ...acc, [id]: [...(acc[id] ?? []), prev.element] };
            }
            return acc;
        },
        {}
    ) as RootEventMap;

    for (const rootElementId in rootEventMap) {
        if (rootEventMap[rootElementId].length < 2) {
            handleValidElement({
                elementId: rootElementId,
            });
        } else {
            handleInvalidElement({
                errorType: ModelerErrorType.CANVAS_ERROR,
                nameKey: 'Process.Details.Modeler.Actions.Event.Start.Label',
                elementId: rootElementId,
            });
        }
    }
};
