import { WidgetProps } from '@rjsf/core';

export interface AutocompleteWidgetProps extends WidgetProps {
    groupBy?: (option: any) => string;
    customError?: string[];
}
