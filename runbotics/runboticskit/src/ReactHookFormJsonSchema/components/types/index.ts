import React, { ReactNode, Ref } from 'react';
import { DeepPartial, FieldValues, FormProviderProps, Mode } from 'react-hook-form';

import { JSONSchemaType, IDSchemaPair } from '../../JSONSchema';
import { CustomValidators } from '../../hooks/validators';
import { UseFormMethods } from 'react-hook-form/dist/types';

export interface JSONFormContextValues<FormValues extends FieldValues = FieldValues>
    extends FormProviderProps<FormValues> {
    schema: JSONSchemaType;
    idMap: IDSchemaPair;
    customValidators?: CustomValidators;
    defaultValues?: DeepPartial<FormValues> | FormValues;
}

export type OnSubmitParameters = {
    data: JSONSchemaType;
    event: React.BaseSyntheticEvent | undefined;
    methods: JSONFormContextValues;
};
export type OnSubmitType = (props: OnSubmitParameters) => void | Promise<void>;

export type FormContextProps<FormValues extends FieldValues = FieldValues> = {
    formProps?: Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'>;
    validationMode?: Mode;
    revalidateMode?: Mode;
    submitFocusError?: boolean;
    onChange?: (data: JSONSchemaType) => void;
    onSubmit?: OnSubmitType;
    noNativeValidate?: boolean;
    customValidators?: CustomValidators;
    schema: JSONSchemaType;
    defaultValues?: DeepPartial<FormValues> | FormValues;
    children: ((props: UseFormMethods) => ReactNode) | ReactNode;
    ref?: Ref<any>;
};
