import { IProcess, UserDto, ProcessCollection, ProcessDto, BasicUserDto } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';

import { FormValidationState } from './EditProcessDialog.types';
import emptyBpmn from '../ProcessBuildView/Modeler/extensions/config/empty.bpmn';

export const DEBOUNCE_TIME = 300;
export const MAX_NUMBER_OF_TAGS = 15;
export const MAX_TAG_LENGTH = 20;

export const initialFormValidationState: FormValidationState = {
    name: false
};

export enum InputErrorType {
    NAME_NOT_AVAILABLE = 'NAME_NOT_AVAILABLE',
    REQUIRED = 'REQUIRED'
}

export const inputErrorMessages: Record<InputErrorType, string> = {
    [InputErrorType.NAME_NOT_AVAILABLE]: translate(
        'Process.Add.Form.Error.NameNotAvailable'
    ),
    [InputErrorType.REQUIRED]: translate('Process.Add.Form.Error.Required')
};

export const getDefaultProcessInfo = (currentUser: BasicUserDto, currentCollection: ProcessCollection): ProcessDto => {
    const defaultProcessInfo: ProcessDto = {
        isPublic: false,
        name: '',
        description: '',
        definition: emptyBpmn,
        createdBy: {
            id: currentUser.id,
            email: currentUser.email,
        },
        created: new Date().toISOString(),
        tags: [],
        ...(currentCollection && { processCollection: { ...currentCollection } }),
    };

    return defaultProcessInfo;
};
