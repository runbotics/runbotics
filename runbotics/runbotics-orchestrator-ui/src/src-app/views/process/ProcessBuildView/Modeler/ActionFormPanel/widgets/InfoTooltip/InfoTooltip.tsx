import styled from 'styled-components';
import If from '#src-app/components/utils/If';
import React from 'react';
import InfoButtonTooltip from './InfoButtonTooltip';

interface InfoTooltipProps {
    text: string;
}

export const FieldWithTooltipWrapper = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
`;

export function InfoTooltip(props: InfoTooltipProps) {
    return (
        <If condition={Boolean(props.text)}>
            <InfoButtonTooltip message={props.text}/>
        </If>
    );
}
