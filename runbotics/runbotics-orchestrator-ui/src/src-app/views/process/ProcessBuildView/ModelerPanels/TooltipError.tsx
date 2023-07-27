import { FC } from 'react';

import { Typography } from '@mui/material';
import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

const TooltipBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const ErrorGroup = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-flow: row;
`;

const ActionRow = styled.span`
    padding-left: 10px;
`;

interface TooltipError {
    connectionErrorElementsNames: string[];
    formErrorElementsNames: string[];
    canvasErrorElementNames: string[];
}

/* eslint-disable react/no-array-index-key */
const TooltipError: FC<TooltipError> = ({
    connectionErrorElementsNames,
    formErrorElementsNames,
    canvasErrorElementNames,
}) => {
    const { translate } = useTranslations();

    return (
        <TooltipBox>
            <If condition={Boolean(connectionErrorElementsNames.length)}>
                <ErrorGroup>
                    <Typography variant='body2'>
                        {translate('Process.MainView.Tooltip.Save.Errors.Connections')}
                    </Typography>
                    {connectionErrorElementsNames.map((error, index) => (
                        <ActionRow key={`${error}-connection-${index}`}>
                            <Typography variant='caption'>
                                {error}
                            </Typography>
                        </ActionRow>
                    ))}
                </ErrorGroup>
            </If>
            <If condition={Boolean(formErrorElementsNames.length)}>
                <ErrorGroup>
                    <Typography variant='body2'>
                        {translate('Process.MainView.Tooltip.Save.Errors.Form')}
                    </Typography>
                    {formErrorElementsNames.map((error, index) => (
                        <ActionRow key={`${error}-form-${index}`}>
                            <Typography variant='caption'>
                                {error}
                            </Typography>
                        </ActionRow>
                    ))}
                </ErrorGroup>
            </If>
            <If condition={Boolean(canvasErrorElementNames.length)}>
                <ErrorGroup>
                    <Typography variant='body2'>
                        {translate('Process.MainView.Tooltip.Save.Errors.Canvas')}
                    </Typography>
                    {canvasErrorElementNames.map((error, index) => (
                        <ActionRow key={`${error}-canvas-${index}`}>
                            <Typography variant='caption'>
                                {error}
                            </Typography>
                        </ActionRow>
                    ))}
                </ErrorGroup>
            </If>
        </TooltipBox>
    );
};

export default TooltipError;
