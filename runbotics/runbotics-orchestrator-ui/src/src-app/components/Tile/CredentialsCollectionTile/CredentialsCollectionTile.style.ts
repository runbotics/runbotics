import { CardContent } from '@mui/material';
import styled from 'styled-components';

export const CredentialCollectionCard = styled(CardContent)(
    ({ theme }) => `
    && {
        padding-bottom: ${theme.spacing(1)} !important;
        cursor: pointer;
        min-height: 258px;
    }

    &:hover {
        background-color: ${theme.palette.action.hover};
    }
`
);

export const ShareOptionSpan = styled.span(({ theme }) => `
  display: flex;
  align-items: center;

  svg {
    margin-right: ${theme.spacing(1)};
  }
`);
