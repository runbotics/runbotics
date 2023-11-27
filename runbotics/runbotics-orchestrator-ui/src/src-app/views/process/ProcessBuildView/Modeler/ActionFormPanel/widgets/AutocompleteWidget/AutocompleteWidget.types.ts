import { WidgetProps } from '@rjsf/core';

import { Options } from '#src-app/hooks/useOptions';

export interface AutocompleteWidgetProps extends Partial<WidgetProps> {
    customErrors?: string[];
    autocompleteOptions?: Options;
    handleEvent?: boolean;
    name?: string;
    handleOnFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleOnBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}
