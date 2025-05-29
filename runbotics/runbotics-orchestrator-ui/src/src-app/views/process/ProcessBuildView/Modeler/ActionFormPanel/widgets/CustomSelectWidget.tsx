import React, { FC } from 'react';

import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';

import BasicSelectField from './components/BasicSelectField';


const TestFiledWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
`;

const CustomSelectWidget: FC<WidgetProps> = (props) => (
    <TestFiledWrapper>
        <BasicSelectField
            {...props}
        />
    </TestFiledWrapper>
);

export default CustomSelectWidget;
