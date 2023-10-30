import React, { FC } from 'react';

import { WidgetProps } from '@rjsf/core';

import If from '#src-app/components/utils/If';
import { Options } from '#src-app/hooks/useOptions';
import {
    TooltipTextFieldWrapper
} from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip.styles';

import AutocompleteWidget from './AutocompleteWidget';
import InfoButtonTooltip from './InfoTooltip/InfoButtonTooltip';

interface ElementAwareAutocompleteProps extends WidgetProps {
    options: {
        info?: string;
    };
    customErrors?: string[];
    autocompleteOptions: Options;
}

const ElementAwareAutocomplete: FC<ElementAwareAutocompleteProps> = (
    props
) => (
    <TooltipTextFieldWrapper>
        <AutocompleteWidget {...props} value={props.value}/>
        <If condition={Boolean(props.options?.info)}>
            <InfoButtonTooltip message={props.options?.info} />
        </If>
    </TooltipTextFieldWrapper>
);

export default ElementAwareAutocomplete;
