import {
    BasicInputReturnType,
    InputTypes,
    UseInputParameters,
    UseRawInputReturnType,
    UseUploadParameters,
    UseUploadReturnType,
} from './types';
import { useGenericInput } from './useGenericInput';

export const getUploadCustomFields = (baseObject: BasicInputReturnType): UseUploadReturnType => {
    return {
        ...baseObject,
        type: InputTypes.upload,
    };
};

export const useUpload: UseUploadParameters = (pointer) => {
    return getUploadCustomFields(useGenericInput(pointer));
};
