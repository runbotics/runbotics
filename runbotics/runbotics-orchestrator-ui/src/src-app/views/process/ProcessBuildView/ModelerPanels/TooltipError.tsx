import { FC } from 'react';

import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

const TooltipBox = styled.div`
    display: flex;
    gap: 2px;
    flex-direction: column;
`;

interface TooltipError {
    connectionErrorElementsNames: string[];
    formErrorElementsNames: string[];
    canvasErrorElementNames: string[];
}
const TooltipError: FC<TooltipError> = ({
    connectionErrorElementsNames,
    formErrorElementsNames,
    canvasErrorElementNames,
}) => {
    const { translate } = useTranslations();

    return (
        <TooltipBox>
            <div>{translate('Process.MainView.Tooltip.Save.Errors.Title')}</div>
            <If condition={Boolean(connectionErrorElementsNames.length)}>
                <div>
                    {translate(
                        'Process.MainView.Tooltip.Save.Errors.Connections',
                        {
                            errors: connectionErrorElementsNames.join(', '),
                        }
                    )}
                </div>
            </If>
            <If condition={Boolean(formErrorElementsNames.length)}>
                <div>
                    {translate('Process.MainView.Tooltip.Save.Errors.Form', {
                        errors: formErrorElementsNames.join(', '),
                    })}
                </div>
            </If>
            <If condition={Boolean(canvasErrorElementNames.length)}>
                <div>
                    {translate('Process.MainView.Tooltip.Save.Errors.Canvas', {
                        errors: canvasErrorElementNames.join(', '),
                    })}
                </div>
            </If>
        </TooltipBox>
    );
};

export default TooltipError;
