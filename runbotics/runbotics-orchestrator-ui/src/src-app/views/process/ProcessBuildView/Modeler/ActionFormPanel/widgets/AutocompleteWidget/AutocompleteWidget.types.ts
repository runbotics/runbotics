import { Options } from '#src-app/hooks/useOptions';

export interface AutocompleteWidgetProps {
    customErrors?: string[];
    rawErrors?: string[];
    autocompleteOptions: Options;
    autofocus?: boolean;
    handleEvent?: boolean;
    name?: string;
    handleOnFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleOnBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    disabled: boolean;
    required: boolean;
    label: string;
    value: string;
    onChange: (value: any) => void;
}
