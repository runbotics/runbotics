import { WidgetProps } from '@rjsf/core';

import { Options } from '#src-app/hooks/useOptions';

export interface AutocompleteWidgetProps extends Partial<WidgetProps> {
    customErrors?: string[];
    autocompleteOptions?: Options;
    withName?: boolean;
    name?: string;
    handleOnFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleOnBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface NewValueWithName {
    name: string;
    value: string;
}
