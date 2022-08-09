// @ts-nocheck
import React, { FC, createContext, useContext, useMemo, useEffect, useImperativeHandle } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { FormContextProps, JSONFormContextValues } from './types';
import { getObjectFromForm, getIdSchemaPairs, resolveRefs } from '../JSONSchema/logic';
import { FieldName } from 'react-hook-form/dist/types/fields';
import { OmitResetState, SetFieldValue, SetValueConfig, UnpackNestedValue } from 'react-hook-form/dist/types/form';
import { DeepPartial } from 'react-hook-form/dist/types/utils';
import { JSONSchemaType } from '../JSONSchema';

export const InternalFormContext = createContext<JSONFormContextValues | null>(null);

export function useFormContext<T extends FieldValues = FieldValues>(): JSONFormContextValues<T> {
    return useContext(InternalFormContext) as JSONFormContextValues<T>;
}
export interface FormImperativeHandle {
    getValues(): UnpackNestedValue<FieldValues>;
    setValue(name: FieldName<FieldValues>, value: SetFieldValue<FieldValues>, config?: SetValueConfig): void;
    reset: (values?: UnpackNestedValue<DeepPartial<FieldValues>>, omitResetState?: OmitResetState) => void;
}

export const mapFormValues = (data: JSONSchemaType) => {
    return Object.entries(data).reduce((previousValue, currentValue) => {
        let key = currentValue[0];
        let value = currentValue[1];
        previousValue['#/properties/' + key] = value;

        return previousValue;
    }, {});
};

export const FormContext: FC<FormContextProps> = React.forwardRef((props, ref) => {
    const {
        formProps: userFormProps,
        onChange,
        validationMode = 'onSubmit',
        revalidateMode = 'onChange',
        submitFocusError = true,
        defaultValues,
    } = props;

    const passProps = typeof props.children === 'function';
    const methods = useForm({
        defaultValues: useMemo(() => {
            return props.defaultValues;
        }, [props.defaultValues]),
        mode: validationMode,
        reValidateMode: revalidateMode,
        submitFocusError: submitFocusError,
    });

    const isFirstRender = React.useRef(true);

    useImperativeHandle(ref, () => ({
        getValues: methods.getValues,
        setValue: methods.setValue,
        reset: methods.reset,
    }));

    if (typeof onChange === 'function') {
        const watchedInputs = methods.watch();

        if (isFirstRender.current === false) {
            onChange(getObjectFromForm(props.schema, watchedInputs));
        }
    }

    const idMap = useMemo(() => getIdSchemaPairs(props.schema), [props.schema]);

    const resolvedSchemaRefs = useMemo(() => resolveRefs(props.schema, idMap, []), [props.schema, idMap]);

    useEffect(() => {
        methods.reset(defaultValues);
    }, [defaultValues]);

    const formContext: JSONFormContextValues = useMemo(() => {
        console.log('formContext', formContext, defaultValues);
        return {
            ...methods,
            defaultValues,
            schema: resolvedSchemaRefs,
            idMap: idMap,
            customValidators: props.customValidators,
        };
    }, [methods, resolvedSchemaRefs, idMap, props.customValidators]);

    const formProps: React.ComponentProps<'form'> = { ...userFormProps };

    formProps.onSubmit = methods.handleSubmit(async (data, event) => {
        if (props.onSubmit) {
            return props.onSubmit({
                data: getObjectFromForm(props.schema, data),
                event: event,
                methods: formContext,
            });
        }
        return;
    });

    if (props.noNativeValidate) {
        formProps.noValidate = props.noNativeValidate;
    }

    if (isFirstRender.current === true) {
        isFirstRender.current = false;
    }

    return (
        <InternalFormContext.Provider value={formContext}>
            <form {...formProps}>
                {!passProps && props.children}
                {passProps && <props.children {...methods} />}
            </form>
        </InternalFormContext.Provider>
    );
});
