import { UseObjectProperties, UseObjectReturnType, BasicInputReturnType, UISchemaType, UITypes } from './types';
import { JSONSubSchemaInfo, JSONSchemaType } from '../JSONSchema';
import { useAnnotatedSchemaFromPointer, concatFormPointer } from '../JSONSchema/path-handler';
import { getAnnotatedSchemaFromPointer, getObjectFromForm } from '../JSONSchema/logic';
import { getGenericInput } from './useGenericInput';
import { getInputCustomFields } from './useInput';
import { getRadioCustomFields } from './useRadio';
import { useFormContext, JSONFormContextValues } from '../components';
import { getSelectCustomFields } from './useSelect';
import { getHiddenCustomFields } from './useHidden';
import { getPasswordCustomFields } from './usePassword';
import { getTextAreaCustomFields } from './useTextArea';
import { getCheckboxCustomFields } from './useCheckbox';
import { getUploadCustomFields } from './useUpload';

function getFromGeneric(genericInput: BasicInputReturnType): UseObjectReturnType {
    const currentObject = genericInput.getObject();
    const inputs: UseObjectReturnType = [];

    switch (currentObject.type) {
        case 'string':
            if (currentObject.enum) {
                inputs.push(getSelectCustomFields(genericInput));
            } else {
                inputs.push(getInputCustomFields(genericInput));
            }
            break;
        case 'integer':
        case 'number':
            inputs.push(getInputCustomFields(genericInput));
            break;
        case 'array':
        case 'boolean':
            inputs.push(getCheckboxCustomFields(genericInput));
            break;
    }
    return inputs;
}

// Outside of this function
function getChildProperties(
    pointer: string,
    UISchema: UISchemaType | undefined,
    formContext: JSONFormContextValues,
    data: JSONSchemaType,
) {
    return (allInputs: UseObjectReturnType, key: string) => {
        const newUISchema = UISchema && UISchema.properties ? UISchema.properties[key] : undefined;

        const currentPointer = concatFormPointer(concatFormPointer(pointer, 'properties'), key);

        const currentPointerInfo = getAnnotatedSchemaFromPointer(currentPointer, data, formContext);

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const newInput = getStructure(formContext, currentPointerInfo, currentPointer, newUISchema, data);

        return allInputs.concat(newInput);
    };
}

function getStructure(
    formContext: JSONFormContextValues,
    pointerInfo: JSONSubSchemaInfo,
    pointer: string,
    UISchema: UISchemaType | undefined,
    data: JSONSchemaType,
): UseObjectReturnType {
    let inputs: UseObjectReturnType = [];
    const { JSONSchema } = pointerInfo;

    const genericInput = getGenericInput(formContext, pointerInfo, pointer);

    if (JSONSchema.type === 'object') {
        const objKeys = Object.keys(JSONSchema.properties);
        const childInputs = objKeys.reduce(getChildProperties(pointer, UISchema, formContext, data), []);
        return childInputs;
    }

    if (!UISchema) {
        return inputs.concat(getFromGeneric(genericInput));
    }

    switch (UISchema.type) {
        case UITypes.default:
            inputs = inputs.concat(getFromGeneric(genericInput));
            break;
        case UITypes.checkbox:
            inputs.push(getCheckboxCustomFields(genericInput));
            break;
        case UITypes.hidden:
            inputs.push(getHiddenCustomFields(genericInput));
            break;
        case UITypes.input:
            inputs.push(getInputCustomFields(genericInput));
            break;
        case UITypes.password:
            inputs.push(getPasswordCustomFields(genericInput));
            break;
        case UITypes.radio:
            inputs.push(getRadioCustomFields(genericInput));
            break;
        case UITypes.select:
            inputs.push(getSelectCustomFields(genericInput));
            break;
        case UITypes.textArea:
            inputs.push(getTextAreaCustomFields(genericInput));
            break;
        case UITypes.upload:
            inputs.push(getUploadCustomFields(genericInput));
            break;
    }

    return inputs;
}

export const useObject: UseObjectProperties = (props) => {
    const formContext = useFormContext();
    const data = getObjectFromForm(formContext.schema, formContext.getValues());
    const childArray = getStructure(
        formContext,
        useAnnotatedSchemaFromPointer(props.pointer, data),
        props.pointer,
        props.UISchema,
        data,
    );

    return childArray;
};
