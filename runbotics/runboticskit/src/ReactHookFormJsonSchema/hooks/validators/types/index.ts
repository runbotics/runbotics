import { JSONSubSchemaInfo, JSONSchemaType, JSONSchemaBaseInstanceTypes } from '../../../JSONSchema';

export enum ErrorTypes {
    required = '__form_error_required__',
    maxLength = '__form_error_maxLength__',
    minLength = '__form_error_minLength__',
    maxValue = '__form_error_maxValue__',
    minValue = '__form_error_minValue__',
    pattern = '__form_error_pattern__',
    notInteger = '__form_error_notInteger__',
    notFloat = '__form_error_notFloat__',
    notDate = '__form_error_notDate__',
    multipleOf = '__form_error_multipleOf__',
    notInEnum = '__form_error_notInEnum',
    undefinedError = '__form_error_undefinedError__',
}

export type ErrorMessageValues = JSONSchemaType['enum'] | JSONSchemaBaseInstanceTypes | undefined;

export type ErrorMessage =
    | {
          message: ErrorTypes | string;
          expected: ErrorMessageValues;
      }
    | undefined;

export type CustomValidatorReturnValue = string | true;

export type CustomValidator = (value: string, context: JSONSubSchemaInfo) => CustomValidatorReturnValue;

export type CustomValidators = Record<string, CustomValidator>;
