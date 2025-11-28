import Ajv from 'ajv';
import _ from 'lodash';

import { BpmnElementType } from 'runbotics-common';

import { ModelerErrorType } from '#src-app/store/slices/Process';
import { VARIABLE_NAME_PATTERN } from '#src-app/types/format';
import {
    getFormData,
    getFormSchema,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementForm';
import {
    BPMNElement,
    BPMNElementRegistry,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

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

export const getModelerActivitiesElementsWithOutput = (
    elements: BPMNElementRegistry
) =>
    Object.entries(elements)?.reduce<BPMNElementRegistry>(
        (acc, [elmKey, elmValue]) => {
            if (
                elmKey.startsWith('Activity') &&
                elmValue.element.businessObject.extensionElements.values[0]
                    ?.outputParameters
            ) {
                return {
                    ...acc,
                    [elmKey]: elmValue,
                };
            }
            return acc;
        },
        {}
    );

export const isModelerSync = ({
    modeler,
    appliedActivities,
    imported,
    commandStack,
    errors,
    customValidationErrors,
    activeDrag,
}: ModelerSyncParams) => {
    if (!modeler) return false;
    const { _elements } = modeler.get('elementRegistry');
    const modelerActivities = getModelerActivities(_elements);
    const areActivitiesMatched = _.isEqual(
        _.sortBy(modelerActivities),
        _.sortBy(appliedActivities)
    );
    if (
        imported &&
        errors.length === 0 &&
        customValidationErrors.length === 0
    ) {
        return true;
    }

    return (
        !activeDrag &&
        areActivitiesMatched &&
        commandStack.commandStackIdx >= 0 &&
        errors.length === 0 &&
        customValidationErrors.length === 0
    );
};

const ajv = new Ajv({
    formats: {
        variableName: VARIABLE_NAME_PATTERN,
    },
});

const validateForm = (element: BPMNElement) => {
    const formData = getFormData(element);
    const validate = ajv.compile(getFormSchema(element));
    return { isValid: validate(formData), formData };
};

const validateConnections = (element: BPMNElement) => {
    const incomingConnections = element.incoming?.filter(
        (flow) => flow.type === BpmnElementType.SEQUENCE_FLOW
    );
    const outgoingConnections = element.outgoing?.filter(
        (flow) => flow.type === BpmnElementType.SEQUENCE_FLOW
    );
    const hasOutgoingConnection = outgoingConnections.length >= 1;

    const hasIncomingConnection = incomingConnections.length >= 1;

    const isStartEventWithoutOutgoingConnection =
        element.type === BpmnElementType.START_EVENT && !hasOutgoingConnection;

    const isEndEventWithoutIncomingConnection =
        element.type === BpmnElementType.END_EVENT && !hasIncomingConnection;

    const isIntermediateEventWithoutIncomingConnection =
        element.type === BpmnElementType.INTERMEDIATE_THROW_EVENT &&
        !hasIncomingConnection;

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
        isSubprocessWithoutConnections ||
        isIntermediateEventWithoutIncomingConnection
    ) {
        return false;
    }

    return true;
};

const validateHostElement = (element: BPMNElement) => {
    if (element?.attachers?.length > 1) return false;
    return true;
};

export const validateElement = ({
    element,
    handleInvalidElement,
    handleValidElement,
    modeler,
}: ValidateElementProps) => {
    const isValidHost = validateHostElement(element);
    if (element.host) {
        validateElement({
            element: element.host,
            handleInvalidElement,
            handleValidElement,
            modeler,
        });
    }

    const isConnectionValid = validateConnections(element);
    if (!isConnectionValid) {
        const formattedType =
            element.type[0].toUpperCase() +
            element.type.replace(':', '.').slice(1);

        handleInvalidElement({
            element,
            modeler,
            errorType: ModelerErrorType.CONNECTION_ERROR,
            nameKey: `Process.Details.Modeler.Actions.${formattedType}.Label`,
        });
        return;
    }

    if (element.id.includes('Activity') === false) {
        handleValidElement({
            element,
            modeler,
        });
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

    if (!isValidHost && !formData.disabled) {
        handleInvalidElement({
            element,
            modeler,
            errorType: ModelerErrorType.CONNECTION_ERROR,
            relatedElements: element.attachers.map((item) => item.id),
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
    // this returns an object with root components ID's as keys (eg: subprocess, main canvas)
    // and an array of all start events inside those roots as values
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

export const validateAllConnections = (
    modeler: any,
    handleInvalidElement: (props: any) => void,
    handleValidElement: (props: any) => void
) => {
    const { _elements } = modeler.get('elementRegistry');

    Object.values(_elements).forEach(
        ({ element }: { element: BPMNElement }) => {
            if (element.id && element.id.includes('Activity')) {
                validateElement({
                    element,
                    handleInvalidElement,
                    handleValidElement,
                    modeler,
                });
            }
        }
    );
};
