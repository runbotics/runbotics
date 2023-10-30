import { WidgetProps } from '@rjsf/core';

import { Options } from '#src-app/hooks/useOptions';

export interface AutocompleteWidgetProps extends WidgetProps {
    customErrors?: string[];
    autocompleteOptions: Options;
}
