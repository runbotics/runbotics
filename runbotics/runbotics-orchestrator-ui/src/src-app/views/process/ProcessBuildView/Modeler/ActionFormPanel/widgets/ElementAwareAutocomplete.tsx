/* eslint-disable max-lines-per-function */
import React, { FC } from 'react';

import { WidgetProps } from '@rjsf/core';

import styled from 'styled-components';

import If from '#src-app/components/utils/If';

import { Options } from '#src-app/hooks/useOptions';

import AutocompleteWidget from './AutocompleteWidget';
import InfoButtonTooltip from './components/InfoButtonTooltip';

interface ElementAwareAutocompleteProps extends WidgetProps {
    options: {
        info?: string;
    };
    customErrors?: string[];
    autocompleteOptions: Options;
}

const AutocompleteWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
`;

const ElementAwareAutocomplete: FC<ElementAwareAutocompleteProps> = (
    props
) => (
    <AutocompleteWrapper>
        <AutocompleteWidget {...props} value={props.value} />
        <If condition={Boolean(props.options?.info)}>
            <InfoButtonTooltip message={props.options?.info} />
        </If>
    </AutocompleteWrapper>
);

export default ElementAwareAutocomplete;
