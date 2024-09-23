import { CardContent } from '@mui/material';
import styled from 'styled-components';

export const CredentialCollectionCard = styled(CardContent)(
    ({ theme }) => `
    && {
        min-height: 258px;
        cursor: pointer;
    }

    &.MuiCardContent-root:last-child {
        padding-bottom: ${theme.spacing(1)}
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
