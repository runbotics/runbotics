import { CardContent } from '@mui/material';
import { Box } from '@mui/system';
import styled from 'styled-components';

export const CredentialCollectionCardontainer = styled(Box)(
    ({ theme }) => `
    display: block;
    width: 100%;
    height: 100%;

    &:hover {
        cursor: pointer;

        & > * {
            background-color: ${theme.palette.action.hover};
        }
    }
`
);

export const CredentialCollectionCard = styled(CardContent)(
    ({ theme }) => `
    && {
        cursor: pointer;
    }

    &.MuiCardContent-root:last-child {
        padding-bottom: ${theme.spacing(0)}
    }
`
);

export const ShareOptionSpan = styled.span(
    ({ theme }) => `
  display: flex;
  align-items: center;

  svg {
    margin-right: ${theme.spacing(1)};
  }
`
);
