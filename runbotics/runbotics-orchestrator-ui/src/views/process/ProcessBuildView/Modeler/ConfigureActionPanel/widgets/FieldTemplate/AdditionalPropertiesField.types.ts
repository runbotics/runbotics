import { JSONSchema7 } from 'json-schema';

type JSONSchema7Labels = JSONSchema7 & { mainFieldLabel?: string, subFieldLabel?: string }; 

export interface AdditionalPropertiesFieldProps {
    children: React.ReactElement;
    classNames: string;
    disabled: boolean;
    id: string;
    label: string;
    onDropPropertyClick: (index: string) => (event?: any) => void;
    onKeyChange: (index: string) => (event?: any) => void;
    readonly: boolean;
    required: boolean;
    schema: JSONSchema7Labels;
}
