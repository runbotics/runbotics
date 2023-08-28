import React, { FC } from 'react';

import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

import useOptions from '#src-app/hooks/useOptions';

import BasicTextField from './components/BasicTextField';
import ElementAwareAutocomplete from './ElementAwareAutocomplete';

const TestFiledWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
`;

const FORM_INPUTS_ID = [
    'root_input_variable',
    'root_output_variable',
    'root_input_elementVariable',
    'root_output_variableName',
];

const CustomTextWidget: FC<WidgetProps> = (props) => {
    const { options, variables } = useOptions();

    const isFieldVariable = Boolean(
        FORM_INPUTS_ID.find((id) => id === props.id)
    );

    return (
        <TestFiledWrapper>
            {isFieldVariable ? (
                <BasicTextField {...props} variables={variables} />
            ) : (
                <ElementAwareAutocomplete
                    {...props}
                    autocompleteOptions={options}
                />
            )}
        </TestFiledWrapper>
    );
};

export default CustomTextWidget;
