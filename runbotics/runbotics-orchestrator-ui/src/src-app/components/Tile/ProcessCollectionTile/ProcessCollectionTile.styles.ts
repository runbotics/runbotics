import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Paper, Typography } from '@mui/material';
import styled from 'styled-components';

export const ProcessCollectionTileWrapper = styled(Paper)(({ theme }) => `
    &[class*="MuiPaper"] {
        display: flex;
        align-items: center;
        max-width: 350px;
        gap: 8px;
        padding: 2px 0 2px 20px;
        background-color: ${theme.palette.grey[200]};
    }
`);

export const CollectionNameWrapper = styled.div`
    max-width: 230px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const MenuWrapper = styled.div`
    margin-left: auto;
`;

export const CollectionListWrapper = styled.div<{ isExpanded?: boolean }>`
    height: ${({ isExpanded }) => isExpanded ? '100%' : '50px'};
    overflow: hidden;
`;

export const ExpandButton = styled.div
    <{ $isExpanded: boolean; }>(({ theme, $isExpanded }) => `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 14px;
    width: 90px;
    padding: 14px;
    margin: 5px 2px;
    border-radius: 10px;
    background-color: ${$isExpanded ? theme.palette.grey[200] : 'transparent'};
    &:hover {
        cursor: pointer;
        background-color: ${theme.palette.grey[300]};
    }
`);

export const StyledTypography = styled(Typography)(({ theme }) => `
    && {
        color: ${theme.palette.grey[500]};
        text-transform: lowercase;
        padding-left: 8px;
    }
`);

export const StyledExpandIcon = styled(ExpandMoreIcon)
    <{ $isExpanded: boolean; }>(({ theme, $isExpanded }) => `
    && {
        color: ${theme.palette.grey[500]};
        transform: rotate(${$isExpanded ? '-180deg' : '0'});
        transition: 0.5s;
    }
`);

export const DividerLine = styled.div(({ theme }) => `
    height: 2px;
    width: 50%;
    margin: auto 6px;
    background-color: ${theme.palette.grey[300]};
`);
