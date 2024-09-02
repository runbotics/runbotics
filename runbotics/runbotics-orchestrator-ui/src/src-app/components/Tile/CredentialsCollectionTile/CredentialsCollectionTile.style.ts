import { CardContent } from '@mui/material';
import styled from 'styled-components';

import { collectionColors } from '#src-app/views/credentials/CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';


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

interface ColorDotProps {
    collectionColor?: string;
}

export const ColorDot = styled.span<ColorDotProps>(
    ({ collectionColor }) => `
    height: 24px;
    width: 24px;
    background-color: ${collectionColors[collectionColor].hex};
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
`
);

export const ShareOptionSpan = styled.span`
    display: flex;
    align-items: center;
`;
