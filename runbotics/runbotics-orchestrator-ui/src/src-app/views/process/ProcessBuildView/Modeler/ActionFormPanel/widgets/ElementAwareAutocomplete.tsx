import React, { FC } from 'react';

import { WidgetProps } from '@rjsf/core';

import { Options } from '#src-app/hooks/useOptions';

import {
    FieldWithTooltipWrapper, InfoTooltip
} from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoTooltip';

import AutocompleteWidget from './AutocompleteWidget';

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
    <FieldWithTooltipWrapper>
        <AutocompleteWidget {...props} value={props.value}/>
        <InfoTooltip text={props.options?.info}/>
    </FieldWithTooltipWrapper>
);

export default ElementAwareAutocomplete;
