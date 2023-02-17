import styled from 'styled-components';

export const PeriodText = styled.span(({ theme }) => `
    margin-left: ${theme.spacing(1)};
    font-weight: ${theme.typography.fontWeightBold};
`);
