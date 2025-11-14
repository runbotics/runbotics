import { JSONSchema7 } from 'json-schema';

type FieldsWithInfo = {
    mainFieldLabel?: string,
    mainFieldInfo?: string,
    subFieldLabel?: string,
    subFieldInfo?: string,
    useEditorWidget?: boolean,
    editorLanguage?: string, 
    editorHeight?: string,
    helpDescription?: string,
};
type JSONSchema7Labels = JSONSchema7 & FieldsWithInfo;

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
