import React, { FC } from 'react';

import { WidgetProps } from '@rjsf/core';

import { Options } from '#src-app/hooks/useOptions';

import {
    TooltipTextfieldWrapper
} from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip.styles';

import AutocompleteWidget from './AutocompleteWidget';
import If from '#src-app/components/utils/If';
import InfoButtonTooltip
    from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

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
    <TooltipTextfieldWrapper>
        <AutocompleteWidget {...props} value={props.value}/>
        <If condition={Boolean(props.options?.info)}>
            <InfoButtonTooltip message={props.options?.info}/>
        </If>
    </TooltipTextfieldWrapper>
);

export default ElementAwareAutocomplete;
