import { FC } from 'react';

import styled from 'styled-components';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

const StyledDiv = styled.div`
    margin-bottom: 2px;
`;

interface TooltipError {
    elementsWithConnectionErrors: string[];
    elementsWithFromErrors: string[];
}
const TooltipError: FC<TooltipError> = ({
    elementsWithConnectionErrors,
    elementsWithFromErrors,
}) => {
    const { translate } = useTranslations();

    return (
        <>
            <StyledDiv>
                {translate('Process.MainView.Tooltip.Save.Errors')}
            </StyledDiv>
            <If condition={Boolean(elementsWithConnectionErrors.length)}>
                <StyledDiv>
                    {translate(
                        'Process.MainView.Tooltip.Save.Errors.Connections',
                        {
                            errors: elementsWithConnectionErrors.join(', '),
                        }
                    )}
                </StyledDiv>
            </If>
            <If condition={Boolean(elementsWithFromErrors.length)}>
                <StyledDiv>
                    {translate('Process.MainView.Tooltip.Save.Errors.Form', {
                        errors: elementsWithFromErrors.join(', '),
                    })}
                </StyledDiv>
            </If>
        </>
    );
};

export default TooltipError;
