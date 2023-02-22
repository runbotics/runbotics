import Ajv from 'ajv';
import _ from 'lodash';

import { BpmnElementType } from 'runbotics-common';

import { ModelerErrorType } from '#src-app/store/slices/Process';
import {
    getFormData,
    getFormSchema,
} from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementForm';
import { BPMNElement } from '#src-app/views/process/ProcessBuildView/Modeler/helpers/elementParameters';

import { ValidateElementProps } from './useModelerListeners.types';

export const getModelerActivities = (elements: BPMNElement[]) =>
    _.sortBy(
        Object.keys(elements)?.filter((elm) => elm.startsWith('Activity'))
    );

export const isModelerInSync = ({
    modeler,
    appliedActivities,
    imported,
    commandStack,
    errors,
}) => {
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
    if (element.id.includes('Activity') === false) {
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

    const isConnectionValid = validateConnections(element);

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
